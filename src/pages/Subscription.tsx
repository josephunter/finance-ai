import { PageHeader } from "@/components/ui/page-header";
import { PricingSection } from '@/components/subscription/PricingSection';

export default function Subscription() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription"
        description="Manage your subscription plan and billing"
      />
      <PricingSection />
    </div>
  );
}