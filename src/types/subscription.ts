export type SubscriptionTier = {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  priceId: string;
  limits: {
    assets: number;
    historicalData: number;
    analytics: boolean;
    api: boolean;
  };
};

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    priceId: '',
    features: [
      'Up to 5 assets',
      'Basic analytics',
      'Manual value updates',
      'Single currency tracking'
    ],
    limits: {
      assets: 5,
      historicalData: 30, // days
      analytics: false,
      api: false
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious investors',
    price: 9.99,
    priceId: 'price_H5jTxfqnkO4le8',
    features: [
      'Up to 50 assets',
      'Advanced analytics',
      'Automated value updates',
      'Multi-currency support',
      '1 year historical data',
      'Export data'
    ],
    limits: {
      assets: 50,
      historicalData: 365,
      analytics: true,
      api: false
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For professional portfolio management',
    price: 29.99,
    priceId: 'price_H5jTxfqnkO4le9',
    features: [
      'Unlimited assets',
      'Advanced analytics',
      'Automated value updates',
      'Multi-currency support',
      'Unlimited historical data',
      'API access',
      'Priority support',
      'Custom reports'
    ],
    limits: {
      assets: Infinity,
      historicalData: Infinity,
      analytics: true,
      api: true
    }
  }
];