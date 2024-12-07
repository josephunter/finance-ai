import { Asset } from '@/types/asset';
import { PerformanceOverview } from './PerformanceOverview';
import { PerformanceDetails } from './PerformanceDetails';

interface AnalyticsContentProps {
  assets: Asset[];
}

export function AnalyticsContent({ assets }: AnalyticsContentProps) {
  const activeAssets = assets.filter(asset => asset.status === 'active');

  return (
    <div className="space-y-8">
      <PerformanceOverview assets={activeAssets} />
      <PerformanceDetails assets={activeAssets} />
    </div>
  );
}