import { Asset, ASSET_TYPES } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface AssetPerformanceGridProps {
  assets: Asset[];
}

export function AssetPerformanceGrid({ assets }: AssetPerformanceGridProps) {
  const { settings } = useUserSettings();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {assets.map(asset => {
        const assetType = ASSET_TYPES.find(type => type.id === asset.type);
        const currentValue = asset.currentValueMasterCurrency || asset.masterCurrencyValue;
        const valueChange = currentValue - asset.masterCurrencyValue;
        const percentageChange = ((valueChange) / asset.masterCurrencyValue) * 100;

        const isPositive = valueChange >= 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

        return (
          <Card key={asset.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{asset.name}</h3>
                  <p className="text-sm text-gray-500">{assetType?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Initial Value</p>
                    <p className="font-medium">
                      {masterCurrency?.symbol}
                      {Math.round(asset.masterCurrencyValue).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(asset.purchaseDate), 'PP')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Current Value</p>
                    <p className="font-medium">
                      {masterCurrency?.symbol}
                      {Math.round(currentValue).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {asset.lastValueUpdate ? format(new Date(asset.lastValueUpdate), 'PP') : '-'}
                    </p>
                  </div>
                </div>

                <div className={trendColor}>
                  <div className="flex items-center">
                    <TrendIcon className="h-4 w-4 mr-1" />
                    <span className="font-medium">
                      {isPositive ? '+' : ''}
                      {percentageChange.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-sm">
                    {isPositive ? '+' : ''}
                    {masterCurrency?.symbol}
                    {Math.abs(Math.round(valueChange)).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}