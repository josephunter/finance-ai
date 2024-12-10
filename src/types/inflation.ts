export interface InflationRate {
  currency: string;
  year: number;
  month: number;
  rate: number; // Monthly rate as decimal (e.g., 0.05 for 5%)
}

export interface AnnualInflationRate {
  currency: string;
  year: number;
  rate: number; // Annual rate as decimal
}

// Sample inflation data (this would normally come from an API)
export const INFLATION_RATES: { [key: string]: AnnualInflationRate[] } = {
  USD: [
    { currency: 'USD', year: 2024, rate: 0.031 }, // 3.1%
    { currency: 'USD', year: 2023, rate: 0.041 }, // 4.1%
    { currency: 'USD', year: 2022, rate: 0.081 }, // 8.1%
    { currency: 'USD', year: 2021, rate: 0.071 }, // 7.1%
    { currency: 'USD', year: 2020, rate: 0.012 }, // 1.2%
  ],
  EUR: [
    { currency: 'EUR', year: 2024, rate: 0.025 }, // 2.5%
    { currency: 'EUR', year: 2023, rate: 0.058 }, // 5.8%
    { currency: 'EUR', year: 2022, rate: 0.085 }, // 8.5%
    { currency: 'EUR', year: 2021, rate: 0.049 }, // 4.9%
    { currency: 'EUR', year: 2020, rate: 0.003 }, // 0.3%
  ],
  GBP: [
    { currency: 'GBP', year: 2024, rate: 0.034 }, // 3.4%
    { currency: 'GBP', year: 2023, rate: 0.075 }, // 7.5%
    { currency: 'GBP', year: 2022, rate: 0.091 }, // 9.1%
    { currency: 'GBP', year: 2021, rate: 0.054 }, // 5.4%
    { currency: 'GBP', year: 2020, rate: 0.009 }, // 0.9%
  ],
  TRY: [
    { currency: 'TRY', year: 2024, rate: 0.64 },  // 64%
    { currency: 'TRY', year: 2023, rate: 0.648 }, // 64.8%
    { currency: 'TRY', year: 2022, rate: 0.642 }, // 64.2%
    { currency: 'TRY', year: 2021, rate: 0.361 }, // 36.1%
    { currency: 'TRY', year: 2020, rate: 0.147 }, // 14.7%
  ],
};