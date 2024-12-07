import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { calculateTotalAccumulatedIncome } from '@/lib/utils/income';
import { Coins, PiggyBank } from 'lucide-react';

interface IncomeStatsProps {
  assets: Asset[];
}

export function IncomeStats({ assets }: IncomeStatsProps) {
  const { settings } = useUserSettings();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);

  const getTotalMonthlyIncome = () => {
    return assets.reduce((total, asset) => {
      if (!asset.incomes || asset.status !== 'active') return total;
      
      return total + asset.incomes.reduce((assetTotal, income) => {
        if (income.status !== 'active') return assetTotal;
        const amount = income.masterCurrencyAmount;
        return assetTotal + (income.frequency === 'yearly' ? amount / 12 : amount);
      }, 0);
    }, 0);
  };

  const getTotalAccumulatedIncome = () => {
    return assets.reduce((total, asset) => {
      if (!asset.incomes || asset.status !== 'active') return total;
      return total + calculateTotalAccumulatedIncome(asset.incomes);
    }, 0);
  };

  const monthlyIncome = getTotalMonthlyIncome();
  const totalAccumulated = getTotalAccumulatedIncome();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {masterCurrency?.symbol}
            {Math.round(monthlyIncome).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total monthly income from all active assets
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Accumulated</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {masterCurrency?.symbol}
            {Math.round(totalAccumulated).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total accumulated income to date
          </p>
        </CardContent>
      </Card>
    </div>
  );
}