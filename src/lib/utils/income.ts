import { AssetIncome } from '@/types/asset';
import { differenceInMonths, differenceInYears, isAfter, isBefore, startOfMonth } from 'date-fns';

export function calculateAccumulatedIncome(income: AssetIncome): number {
  const now = new Date();
  const startDate = new Date(income.startDate);
  const endDate = income.endDate ? new Date(income.endDate) : now;

  // If income hasn't started yet or is inactive
  if (isAfter(startDate, now) || income.status !== 'active') {
    return 0;
  }

  // Calculate the effective end date
  const effectiveEndDate = isBefore(endDate, now) ? endDate : now;

  // Calculate the duration based on frequency
  let duration: number;
  if (income.frequency === 'monthly') {
    duration = differenceInMonths(effectiveEndDate, startDate);
  } else { // yearly
    duration = differenceInYears(effectiveEndDate, startDate);
    // Add partial year if applicable
    const remainingMonths = differenceInMonths(effectiveEndDate, startDate) % 12;
    duration += remainingMonths / 12;
  }

  // Calculate total accumulated income
  const amount = income.masterCurrencyAmount;
  return income.frequency === 'monthly' ? amount * duration : amount * duration;
}

export function calculateTotalAccumulatedIncome(incomes: AssetIncome[]): number {
  return incomes.reduce((total, income) => total + calculateAccumulatedIncome(income), 0);
}