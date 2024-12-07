import { PricingSection } from '@/components/subscription/PricingSection';

export default function Subscription() {
  return (
    <div className="py-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Subscription</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and billing
        </p>
      </div>

      <PricingSection />
    </div>
  );
}