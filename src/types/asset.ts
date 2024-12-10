export type AssetType = 
  | 'real_estate'
  | 'gold'
  | 'term_deposit'
  | 'stock'
  | 'bond'
  | 'crypto'
  | 'forex'
  | 'mutual_fund'
  | 'commodity'
  | 'cash'
  | 'vehicle';

export type AssetStatus = 'active' | 'inactive';

export interface AssetIncome {
  id?: string;
  assetId: string;
  startDate: string;
  endDate?: string;
  amount: number;
  currency: string;
  masterCurrencyAmount: number;
  masterCurrency: string;
  frequency: 'monthly' | 'yearly';
  description?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  purchaseDate: string;
  purchaseValue: number;
  purchaseCurrency: string;
  masterCurrencyValue: number;
  currentValue: number;
  description?: string;
  userId: string;
  inactiveDate?: string;
  inactiveReason?: string;
  hasIncome?: boolean;
}

export interface AssetValue {
  id?: string;
  assetId: string;
  date: string;
  value: number;
  currency: string;
  masterCurrencyValue: number;
  masterCurrency: string;
  isInitial?: boolean;
}

export const ASSET_TYPES: { [key in AssetType]: string } = {
  real_estate: 'Real Estate',
  gold: 'Gold',
  term_deposit: 'Term Deposit',
  stock: 'Stock',
  bond: 'Bond',
  crypto: 'Cryptocurrency',
  forex: 'Forex',
  mutual_fund: 'Mutual Fund',
  commodity: 'Commodity',
  cash: 'Cash',
  vehicle: 'Vehicle'
};

export const ASSET_STATUS: { [key in AssetStatus]: string } = {
  active: 'Active',
  inactive: 'Inactive'
};

export const INCOME_FREQUENCIES = {
  monthly: 'Monthly',
  yearly: 'Yearly'
} as const;