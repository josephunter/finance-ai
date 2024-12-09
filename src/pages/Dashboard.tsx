import { useAuth } from '@/contexts/AuthContext';
import { useAssets } from '@/hooks/useAssets';
import { AssetStats } from '@/components/dashboard/AssetStats';
import { AssetSummaryTable } from '@/components/dashboard/AssetSummaryTable';
import { AssetDistributionChart } from '@/components/dashboard/AssetDistributionChart';
import { IncomeStats } from '@/components/dashboard/IncomeStats';
import { IncomeDistributionChart } from '@/components/dashboard/IncomeDistributionChart';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageHeader } from "@/components/ui/page-header";

export default function Dashboard() {
  const { user } = useAuth();
  const { assets, loading, error } = useAssets(user?.uid);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="text-center text-red-500">
          <p>Error loading dashboard data.</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio and recent activities"
      />
      <AssetStats assets={assets} />
      <IncomeStats assets={assets} />
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Asset Summary</h2>
        <AssetSummaryTable assets={assets} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AssetDistributionChart assets={assets} />
        <IncomeDistributionChart assets={assets} />
      </div>
    </div>
  );
}