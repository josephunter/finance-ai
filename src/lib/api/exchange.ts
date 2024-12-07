import { Currency } from '@/types/currency';
import { CURRENCY_API } from './config';
import { CurrencyApiResponse } from './types';
import { CurrencyApiError, ExchangeRateError } from './errors';

async function fetchExchangeRate(endpoint: string, params: Record<string, string>): Promise<CurrencyApiResponse> {
  const queryParams = new URLSearchParams({
    apikey: CURRENCY_API.KEY,
    ...params
  });

  const response = await fetch(`${CURRENCY_API.BASE_URL}${endpoint}?${queryParams}`);
  const data = await response.json();

  if (data.error) {
    throw new CurrencyApiError(
      data.error.message || 'Failed to fetch exchange rate',
      data.error.code
    );
  }

  return data;
}

export async function getHistoricalRate(
  date: string,
  from: Currency['code'],
  to: Currency['code']
): Promise<number> {
  try {
    const formattedDate = date.split('T')[0]; // Extract YYYY-MM-DD format
    
    const data = await fetchExchangeRate(CURRENCY_API.ENDPOINTS.HISTORICAL, {
      date: formattedDate,
      base_currency: from,
      currencies: to
    });
    
    const rates = data.data[formattedDate];
    if (!rates || typeof rates === 'number' || !(to in rates)) {
      throw new ExchangeRateError(`No exchange rate found for ${from} to ${to} on ${formattedDate}`);
    }
    
    return rates[to];
  } catch (error) {
    if (error instanceof CurrencyApiError || error instanceof ExchangeRateError) {
      throw error;
    }
    throw new ExchangeRateError(`Failed to get historical rate: ${error.message}`);
  }
}

export async function convertAmount(
  amount: number,
  from: Currency['code'],
  to: Currency['code']
): Promise<number> {
  if (from === to) return amount;
  
  try {
    const data = await fetchExchangeRate(CURRENCY_API.ENDPOINTS.LATEST, {
      base_currency: from,
      currencies: to
    });
    
    const rate = data.data[to];
    if (typeof rate !== 'number') {
      throw new ExchangeRateError(`Invalid exchange rate received for ${from} to ${to}`);
    }
    
    return amount * rate;
  } catch (error) {
    if (error instanceof CurrencyApiError || error instanceof ExchangeRateError) {
      throw error;
    }
    throw new ExchangeRateError(`Failed to convert amount: ${error.message}`);
  }
}