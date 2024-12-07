import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset, ASSET_TYPES } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { calculateTotalAccumulatedIncome } from '@/lib/utils/income';
import { PerformanceMetrics } from './PerformanceMetrics';
import { PerformanceChart } from './PerformanceChart';
import { format } from 'date-fns';

interface AssetPerformanceReportProps {
  asset: Asset;
}

export function AssetPerformanceReport({ asset }: AssetPerformanceReportProps) {
  const { settings } = useUserSettings();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);
  const assetType = ASSET_TYPES.find(type => type.id === asset.type);

  const metrics = useMemo(() => {
    const latestValue = asset.values?.[0]?.masterCurrencyValue || asset.masterCurrencyValue;
    const valueChange = latestValue - asset.masterCurrencyValue;
    const percentageChange = ((valueChange) / asset.masterCurrencyValue) * 100;
    
    const totalIncome = asset.incomes 
      ? calculateTotalAccumulatedIncome(asset.incomes)
      : 0;

    const monthlyIncome = asset.incomes?.reduce((total, income) => {
      if (income.status !== 'active') return total;
      const amount = income.masterCurrencyAmount;
      return total + (income.frequency === 'yearly' ? amount / 12 : amount);
    }, 0) || 0;

    const totalReturn = valueChange + totalIncome;
    const totalReturnPercentage = (totalReturn / asset.masterCurrencyValue) * 100;

    return {
      initialValue: asset.masterCurrencyValue,
      currentValue: latestValue,
      valueChange,
      percentageChange,
      monthlyIncome,
      totalIncome,
      totalReturn,
      totalReturnPercentage,
    };
  }, [asset]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{asset.name}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {assetType?.name} • Purchased on {format(new Date(asset.purchaseDate), 'PP')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <PerformanceMetrics 
          metrics={metrics}
          currency={masterCurrency}
        />
        <PerformanceChart 
          asset={asset}
          metrics={metrics}
          currency={masterCurrency}
        />
      </CardContent>
    </Card>
  );
}