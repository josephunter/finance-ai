import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { SubscriptionTier } from '@/types/subscription';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckoutSession } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';

interface PricingCardProps {
  tier: SubscriptionTier;
  isCurrentPlan?: boolean;
}

export function PricingCard({ tier, isCurrentPlan }: PricingCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (tier.price === 0) {
        // Handle free tier subscription
        return;
      }

      const session = await createCheckoutSession(tier.priceId, user.uid);
      window.location.href = session.url;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process subscription',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={isCurrentPlan ? 'border-primary' : ''}>
      <CardHeader>
        <CardTitle>{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-3xl font-bold">
          ${tier.price}
          <span className="text-sm font-normal text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? 'outline' : 'default'}
          disabled={isCurrentPlan}
          onClick={handleSubscribe}
        >
          {isCurrentPlan ? 'Current Plan' : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  );
}