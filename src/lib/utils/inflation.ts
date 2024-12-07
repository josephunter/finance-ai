import { differenceInMonths, eachMonthOfInterval, format } from 'date-fns';
import { InflationData } from '@/lib/api/inflation';

export function calculateInflationBetweenDates(
  startDate: Date,
  endDate: Date,
  inflationData: InflationData[]
): {
  cumulativeRate: number;
  monthlyRates: { date: string; rate: number }[];
} {
  // Get all months between the dates
  const months = eachMonthOfInterval({ start: startDate, end: endDate });
  
  // Create a lookup for inflation rates by year
  const inflationRatesByYear = inflationData.reduce((acc, item) => ({
    ...acc,
    [item.year]: item.value / 12 // Convert annual rate to monthly
  }), {} as { [key: string]: number });

  // Calculate monthly rates
  const monthlyRates = months.map(date => {
    const year = date.getFullYear().toString();
    const monthlyRate = inflationRatesByYear[year] || 0;
    return {
      date: format(date, 'yyyy-MM'),
      rate: monthlyRate
    };
  });

  // Calculate cumulative rate
  const cumulativeRate = monthlyRates.reduce((acc, { rate }) => acc + rate, 0);

  return {
    cumulativeRate,
    monthlyRates
  };
}

export function calculateInflationAdjustedValue(
  value: number,
  startDate: Date,
  endDate: Date,
  inflationData: InflationData[]
): number {
  const { cumulativeRate } = calculateInflationBetweenDates(startDate, endDate, inflationData);
  return value * (1 + cumulativeRate / 100);
}