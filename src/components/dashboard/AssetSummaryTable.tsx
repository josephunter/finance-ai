import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Asset, ASSET_TYPES } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AssetSummaryTableProps {
  assets: Asset[];
}

export function AssetSummaryTable({ assets }: AssetSummaryTableProps) {
  const { settings } = useUserSettings();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);

  const activeAssets = assets
    .filter(asset => asset.status === 'active')
    .map(asset => {
      const assetType = ASSET_TYPES.find(type => type.id === asset.type);
      const currentValue = asset.currentValueMasterCurrency || asset.masterCurrencyValue;
      const valueChange = currentValue - asset.masterCurrencyValue;
      const percentageChange = ((valueChange) / asset.masterCurrencyValue) * 100;

      return {
        ...asset,
        assetType,
        currentValue,
        valueChange,
        percentageChange,
      };
    })
    .sort((a, b) => b.currentValue - a.currentValue);

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Initial Value</TableHead>
            <TableHead>Current Value</TableHead>
            <TableHead>Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell>{asset.assetType?.name}</TableCell>
              <TableCell>
                {masterCurrency?.symbol}
                {Math.round(asset.masterCurrencyValue).toLocaleString()}
              </TableCell>
              <TableCell>
                {masterCurrency?.symbol}
                {Math.round(asset.currentValue).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className={asset.valueChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  <div className="flex items-center">
                    {asset.valueChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>
                      {asset.percentageChange >= 0 ? '+' : ''}
                      {asset.percentageChange.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-sm">
                    {asset.valueChange >= 0 ? '+' : ''}
                    {masterCurrency?.symbol}
                    {Math.abs(Math.round(asset.valueChange)).toLocaleString()}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}