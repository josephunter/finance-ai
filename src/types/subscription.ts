export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  assetLimit: number;
  priceId: string; // Stripe Price ID
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 5 assets',
      'Basic analytics',
      'Single currency support',
      'Manual value updates'
    ],
    assetLimit: 5,
    priceId: '' // Free plan doesn't need a Stripe price ID
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious investors',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 25 assets',
      'Advanced analytics',
      'Multi-currency support',
      'Automated value updates',
      'Income tracking',
      'Inflation impact analysis'
    ],
    assetLimit: 25,
    priceId: 'price_pro_monthly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For portfolio managers',
    price: 29.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited assets',
      'Premium analytics',
      'Multi-currency support',
      'Automated value updates',
      'Income tracking',
      'Inflation impact analysis',
      'API access',
      'Priority support'
    ],
    assetLimit: Infinity,
    priceId: 'price_enterprise_monthly'
  }
];