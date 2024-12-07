import { Currency } from '@/types/currency';

const OECD_API_URL = 'https://stats.oecd.org/sdmx-json/data';
const DATASET = 'PRICES_CPI';

// Map currency codes to OECD country codes
const COUNTRY_MAPPING: Record<string, string> = {
  USD: 'USA',
  EUR: 'EA19', // Euro Area
  GBP: 'GBR',
  JPY: 'JPN',
  TRY: 'TUR',
  CNY: 'CHN',
  INR: 'IND',
};

// Cache inflation data to avoid repeated API calls
const inflationCache: Record<string, {
  data: InflationData[];
  timestamp: number;
}> = {};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface InflationData {
  year: number;
  value: number;
}

async function fetchOECDData(countryCode: string): Promise<number[]> {
  const endYear = new Date().getFullYear();
  const startYear = endYear - 5;

  const url = `${OECD_API_URL}/${DATASET}/A.${countryCode}.CPALTT01.GY.P/all?startTime=${startYear}&endTime=${endYear}&dimensionAtObservation=allDimensions`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch OECD data');
  }

  const data = await response.json();
  const observations = data.dataSets[0].observations;
  
  // Extract values from the OECD response format
  const values: number[] = [];
  for (const key in observations) {
    const value = observations[key][0];
    if (typeof value === 'number' && !isNaN(value)) {
      values.push(value);
    }
  }

  return values;
}

export async function getInflationData(currency: Currency['code']): Promise<InflationData[]> {
  try {
    // Check cache first
    const cached = inflationCache[currency];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const countryCode = COUNTRY_MAPPING[currency];
    if (!countryCode) {
      throw new Error(`No country mapping found for currency ${currency}`);
    }

    const yearlyRates = await fetchOECDData(countryCode);
    const currentYear = new Date().getFullYear();

    // Convert yearly rates to monthly and create data points
    const inflationData: InflationData[] = yearlyRates.map((rate, index) => ({
      year: currentYear - yearlyRates.length + index + 1,
      value: rate / 12, // Convert annual rate to monthly
    }));

    // Cache the results
    inflationCache[currency] = {
      data: inflationData,
      timestamp: Date.now(),
    };

    return inflationData;
  } catch (error) {
    console.error('Error fetching inflation data:', error);
    
    // Return fallback data if API fails
    return [
      { year: new Date().getFullYear(), value: 2.5 / 12 }, // Use conservative estimate
    ];
  }
}

export function calculateInflationAdjustedValue(
  originalValue: number,
  originalDate: string,
  currentDate: string,
  inflationData: InflationData[]
): number {
  const monthsDiff = Math.floor(
    (new Date(currentDate).getTime() - new Date(originalDate).getTime()) / 
    (1000 * 60 * 60 * 24 * 30)
  );

  if (monthsDiff <= 0) return originalValue;

  const monthlyRate = inflationData[0]?.value || 0;
  return originalValue * Math.pow(1 + monthlyRate / 100, monthsDiff);
}

export function calculateInflationBetweenDates(
  startDate: Date,
  endDate: Date,
  inflationData: InflationData[]
): {
  cumulativeRate: number;
  monthlyRates: { date: string; rate: number }[];
} {
  const monthsDiff = Math.floor(
    (endDate.getTime() - startDate.getTime()) / 
    (1000 * 60 * 60 * 24 * 30)
  );

  if (monthsDiff <= 0) {
    return {
      cumulativeRate: 0,
      monthlyRates: [],
    };
  }

  // Get the applicable inflation rate based on the year
  const getMonthlyRate = (date: Date) => {
    const year = date.getFullYear();
    const yearData = inflationData.find(data => data.year === year);
    return yearData?.value || inflationData[0]?.value || 0;
  };

  // Calculate monthly rates
  const monthlyRates = Array.from({ length: monthsDiff }, (_, i) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    return {
      date: date.toISOString().slice(0, 7), // YYYY-MM format
      rate: getMonthlyRate(date),
    };
  });

  // Calculate cumulative rate
  const cumulativeRate = monthlyRates.reduce((acc, { rate }) => 
    acc + rate, 0
  );

  return {
    cumulativeRate,
    monthlyRates,
  };
}