import { useMemo } from 'react';
import { format } from 'date-fns';
import { Asset, AssetValue } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { Card } from '@/components/ui/card';
import { MonthlyValueTable } from './MonthlyValueTable';
import { ValueChart } from './ValueChart';
import { useInflationData } from '@/hooks/useInflationData';

interface AssetValueAnalyticsProps {
  asset: Asset;
  values: AssetValue[];
}

export function AssetValueAnalytics({ asset, values }: AssetValueAnalyticsProps) {
  const { settings } = useUserSettings();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);
  const { inflationData, loading } = useInflationData(settings.masterCurrency?.code);

  const monthlyData = useMemo(() => {
    return values
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(value => ({
        month: format(new Date(value.date), 'MMM yyyy'),
        value: value.masterCurrencyValue,
        date: value.date,
      }));
  }, [values]);

  if (values.length === 0 || !asset) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No value history available</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Loading inflation data...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        Value History
      </h3>
      <MonthlyValueTable 
        data={monthlyData}
        inflationData={inflationData}
        currency={masterCurrency}
        initialValue={asset.masterCurrencyValue}
        initialDate={asset.purchaseDate}
      />
      <ValueChart 
        data={monthlyData}
        currency={masterCurrency}
        inflationData={inflationData}
        initialDate={asset.purchaseDate}
        initialValue={asset.masterCurrencyValue}
      />
    </div>
  );
}