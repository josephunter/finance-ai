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
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Performance Overview
        </h2>
        <PerformanceOverview assets={activeAssets} />
      </div>
      
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Performance Details
        </h2>
        <PerformanceDetails assets={activeAssets} />
      </div>
    </div>
  );
}