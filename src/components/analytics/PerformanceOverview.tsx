import { Asset } from '@/types/asset';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { CURRENCIES } from '@/types/currency';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceOverviewProps {
  assets: Asset[];
}

export function PerformanceOverview({ assets }: PerformanceOverviewProps) {
  const { settings } = useUserSettings();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);

  const totals = assets.reduce((acc, asset) => {
    const currentValue = asset.currentValueMasterCurrency || asset.masterCurrencyValue;
    const initialValue = asset.masterCurrencyValue;
    const change = currentValue - initialValue;
    const percentageChange = initialValue > 0 ? (change / initialValue) * 100 : 0;

    return {
      initialValue: acc.initialValue + initialValue,
      currentValue: acc.currentValue + currentValue,
      weightedPercentageSum: acc.weightedPercentageSum + (percentageChange * initialValue),
      totalInitialForPercentage: acc.totalInitialForPercentage + initialValue,
    };
  }, {
    initialValue: 0,
    currentValue: 0,
    weightedPercentageSum: 0,
    totalInitialForPercentage: 0,
  });

  const percentageChange = totals.totalInitialForPercentage > 0
    ? totals.weightedPercentageSum / totals.totalInitialForPercentage
    : 0;

  const totalChange = totals.currentValue - totals.initialValue;
  const isPositive = totalChange >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Initial Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {masterCurrency?.symbol}
            {Math.round(totals.initialValue).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total initial value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <TrendIcon className={`h-4 w-4 ${trendColor}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {masterCurrency?.symbol}
            {Math.round(totals.currentValue).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total current value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Return</CardTitle>
          <TrendIcon className={`h-4 w-4 ${trendColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${trendColor}`}>
            {isPositive ? '+' : ''}
            {percentageChange.toFixed(2)}%
          </div>
          <p className={`text-sm ${trendColor}`}>
            {isPositive ? '+' : ''}
            {masterCurrency?.symbol}
            {Math.abs(Math.round(totalChange)).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}