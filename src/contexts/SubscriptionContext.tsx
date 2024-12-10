import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Subscription, SUBSCRIPTION_PLANS, SubscriptionPlan } from '../types/subscription';

interface SubscriptionContextType {
  subscription: Subscription | null;
  currentPlan: SubscriptionPlan;
  loading: boolean;
  error: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'subscriptions', user.uid),
      (doc) => {
        if (doc.exists()) {
          setSubscription(doc.data() as Subscription);
        } else {
          // If no subscription exists, set to free plan
          setSubscription({
            id: 'free',
            userId: user.uid,
            planId: 'free',
            status: 'active',
            currentPeriodStart: Date.now(),
            currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
            cancelAtPeriodEnd: false
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching subscription:', error);
        setError('Failed to load subscription details');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === subscription?.planId) || SUBSCRIPTION_PLANS[0];

  return (
    <SubscriptionContext.Provider value={{ subscription, currentPlan, loading, error }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};