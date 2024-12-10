import { differenceInMonths, parseISO, startOfMonth } from 'date-fns';

// Temporarily return fixed values instead of making API calls
export async function calculateInflationAdjustedValue(
  originalValue: number,
  purchaseDate: string,
  currency: string
): Promise<number> {
  try {
    // Temporary: Use a fixed 5% annual inflation rate
    const purchaseDate_ = new Date(purchaseDate);
    const now = new Date();
    const monthsDiff = differenceInMonths(now, purchaseDate_);
    const annualRate = 0.05; // 5% annual inflation
    const monthlyRate = annualRate / 12;
    const cumulativeInflation = Math.pow(1 + monthlyRate, monthsDiff) - 1;
    
    return originalValue * (1 + cumulativeInflation);
  } catch (error) {
    console.error('Error calculating inflation adjusted value:', error);
    return originalValue;
  }
}

export function calculateInflationImpact(
  currentValue: number,
  inflationAdjustedValue: number
): number {
  if (inflationAdjustedValue <= 0) return 0;
  return ((currentValue - inflationAdjustedValue) / inflationAdjustedValue) * 100;
}