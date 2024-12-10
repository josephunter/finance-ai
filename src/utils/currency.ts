import { addDays, format, isAfter } from 'date-fns';

export const CURRENCY_API = {
  KEY: 'fca_live_yaLlneX5w9Y9kas81u6RK5lV5BepiiEk8NoaQxIk',
  BASE_URL: 'https://api.freecurrencyapi.com/v1',
  ENDPOINTS: {
    HISTORICAL: '/historical',
    LATEST: '/latest'
  }
} as const;

export async function getHistoricalRate(
  date: string,
  from: string,
  to: string,
  retryCount = 3
): Promise<number> {
  try {
    const response = await fetch(
      `${CURRENCY_API.BASE_URL}${CURRENCY_API.ENDPOINTS.HISTORICAL}?apikey=${CURRENCY_API.KEY}&date=${date}&base_currency=${from}&currencies=${to}`
    );
    const data = await response.json();
    
    if (data.error) {
      // If we have retries left and got an error, try the previous day
      if (retryCount > 0) {
        const previousDate = addDays(new Date(date), -1);
        const formattedDate = format(previousDate, 'yyyy-MM-dd');
        console.log(`Retrying with previous date: ${formattedDate}`);
        return getHistoricalRate(formattedDate, from, to, retryCount - 1);
      }
      throw new Error(data.message || 'Failed to fetch exchange rate');
    }
    
    return data.data[date][to];
  } catch (error) {
    if (retryCount > 0) {
      const previousDate = addDays(new Date(date), -1);
      const formattedDate = format(previousDate, 'yyyy-MM-dd');
      console.log(`Error occurred, retrying with previous date: ${formattedDate}`);
      return getHistoricalRate(formattedDate, from, to, retryCount - 1);
    }
    console.error('Error fetching historical rate:', error);
    throw error;
  }
}

// Cache for storing exchange rates to minimize API calls
const rateCache: {
  [key: string]: {
    rate: number;
    timestamp: number;
  };
} = {};

// Helper function to get cached rate or fetch new one
export async function getExchangeRate(
  from: string,
  to: string,
  date?: string
): Promise<number> {
  const cacheKey = `${from}-${to}-${date || 'latest'}`;
  const now = Date.now();
  const cacheExpiry = 1000 * 60 * 60; // 1 hour

  // Check cache first
  const cachedRate = rateCache[cacheKey];
  if (cachedRate && (now - cachedRate.timestamp) < cacheExpiry) {
    return cachedRate.rate;
  }

  // If no date is provided or date is in the future, fetch latest rate
  if (!date || isAfter(new Date(date), new Date())) {
    try {
      const response = await fetch(
        `${CURRENCY_API.BASE_URL}${CURRENCY_API.ENDPOINTS.LATEST}?apikey=${CURRENCY_API.KEY}&base_currency=${from}&currencies=${to}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to fetch exchange rate');
      }

      const rate = data.data[to];
      
      // Cache the result
      rateCache[cacheKey] = {
        rate,
        timestamp: now
      };

      return rate;
    } catch (error) {
      console.error('Error fetching latest rate:', error);
      throw error;
    }
  }

  // Fetch historical rate with retry logic
  const rate = await getHistoricalRate(date, from, to);
  
  // Cache the result
  rateCache[cacheKey] = {
    rate,
    timestamp: now
  };

  return rate;
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string,
  date?: string
): Promise<number> {
  try {
    const rate = await getExchangeRate(from, to, date);
    return amount * rate;
  } catch (error) {
    console.error('Currency conversion error:', error);
    throw new Error('Failed to convert currency. Please try again later.');
  }
}