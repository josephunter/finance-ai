import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { SUBSCRIPTION_TIERS, SubscriptionTier } from '@/types/subscription';

export function useSubscription() {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      if (!user) {
        setCurrentTier(SUBSCRIPTION_TIERS[0]); // Free tier
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'subscriptions', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const subscription = docSnap.data();
          const tier = SUBSCRIPTION_TIERS.find(t => t.id === subscription.tierId);
          setCurrentTier(tier || SUBSCRIPTION_TIERS[0]);
        } else {
          setCurrentTier(SUBSCRIPTION_TIERS[0]); // Free tier
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
        setCurrentTier(SUBSCRIPTION_TIERS[0]); // Fallback to free tier
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, [user]);

  return {
    currentTier,
    loading,
    isProPlan: currentTier?.id === 'pro',
    isEnterprisePlan: currentTier?.id === 'enterprise',
    canAddMoreAssets: (assetCount: number) => {
      return currentTier ? assetCount < currentTier.limits.assets : false;
    },
    hasAnalytics: currentTier?.limits.analytics || false,
    hasApiAccess: currentTier?.limits.api || false,
  };
}