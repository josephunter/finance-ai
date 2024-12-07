import { PricingCard } from './PricingCard';
import { SUBSCRIPTION_TIERS } from '@/types/subscription';
import { useSubscription } from '@/hooks/useSubscription';

export function PricingSection() {
  const { currentTier } = useSubscription();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that's right for you
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {SUBSCRIPTION_TIERS.map((tier) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            isCurrentPlan={currentTier?.id === tier.id}
          />
        ))}
      </div>
    </div>
  );
}