export type AssetType = {
  id: string;
  name: string;
  icon: string;
  description: string;
  incomeTypes: IncomeType[];
};

export type IncomeType = {
  id: string;
  name: string;
  description: string;
};

export type AssetValue = {
  id: string;
  assetId: string;
  date: string;
  value: number;
  currency: string;
  masterCurrencyValue: number;
  createdAt: string;
};

export type AssetIncome = {
  id: string;
  assetId: string;
  type: string;
  amount: number;
  currency: string;
  masterCurrencyAmount: number;
  frequency: 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type Asset = {
  id: string;
  name: string;
  type: string;
  purchaseDate: string;
  purchaseValue: number;
  purchaseCurrency: string;
  masterCurrencyValue: number;
  currentValue?: number;
  currentValueCurrency?: string;
  currentValueMasterCurrency?: number;
  lastValueUpdate?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  values?: AssetValue[];
  incomes?: AssetIncome[];
};

export const ASSET_TYPES: AssetType[] = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: 'building',
    description: 'Properties, land, and real estate investments',
    incomeTypes: [
      { id: 'rental', name: 'Rental Income', description: 'Monthly rental payments' },
      { id: 'appreciation', name: 'Appreciation', description: 'Increase in property value' }
    ]
  },
  {
    id: 'vehicle',
    name: 'Vehicle',
    icon: 'car',
    description: 'Cars, boats, and other vehicles',
    incomeTypes: [
      { id: 'rental', name: 'Rental Income', description: 'Vehicle rental payments' }
    ]
  },
  {
    id: 'stock',
    name: 'Stock',
    icon: 'trending-up',
    description: 'Company shares and equity investments',
    incomeTypes: [
      { id: 'dividend', name: 'Dividend', description: 'Regular dividend payments' }
    ]
  },
  {
    id: 'cash',
    name: 'Cash',
    icon: 'banknote',
    description: 'Physical cash and bank deposits',
    incomeTypes: [
      { id: 'interest', name: 'Interest', description: 'Bank interest earnings' }
    ]
  },
  {
    id: 'fixed-deposit',
    name: 'Fixed Deposit',
    icon: 'piggy-bank',
    description: 'Time deposits and savings accounts',
    incomeTypes: [
      { id: 'interest', name: 'Interest', description: 'Fixed deposit interest' }
    ]
  },
  {
    id: 'bond',
    name: 'Bond',
    icon: 'landmark',
    description: 'Government and corporate bonds',
    incomeTypes: [
      { id: 'coupon', name: 'Coupon Payment', description: 'Regular bond interest payments' }
    ]
  },
  {
    id: 'eurobond',
    name: 'Eurobond',
    icon: 'euro',
    description: 'International bonds denominated in foreign currency',
    incomeTypes: [
      { id: 'coupon', name: 'Coupon Payment', description: 'Regular bond interest payments' }
    ]
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: 'bitcoin',
    description: 'Digital currencies and crypto assets',
    incomeTypes: [
      { id: 'staking', name: 'Staking Rewards', description: 'Cryptocurrency staking income' },
      { id: 'mining', name: 'Mining Rewards', description: 'Cryptocurrency mining income' }
    ]
  },
  {
    id: 'precious-metal',
    name: 'Precious Metal',
    icon: 'gem',
    description: 'Gold, silver, and other precious metals',
    incomeTypes: []
  }
];