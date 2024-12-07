import { useAuth } from '@/contexts/AuthContext';
import { useAssets } from '@/hooks/useAssets';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsContent } from '@/components/analytics/AnalyticsContent';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Analytics() {
  const { user } = useAuth();
  const { assets, loading, error } = useAssets(user?.uid);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="text-center text-red-500">
          <p>Error loading analytics data.</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <AnalyticsHeader />
      <AnalyticsContent assets={assets} />
    </div>
  );
}