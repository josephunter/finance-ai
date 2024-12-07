import { useMemo, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Asset, ASSET_TYPES } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { calculateTotalAccumulatedIncome } from '@/lib/utils/income';
import { getInflationData, calculateInflationAdjustedValue, type InflationData } from '@/lib/api/inflation';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface AssetPerformanceTableProps {
  assets: Asset[];
}

export function AssetPerformanceTable({ assets }: AssetPerformanceTableProps) {
  const { settings } = useUserSettings();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);
  const [inflationData, setInflationData] = useState<InflationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInflationData() {
      if (!masterCurrency) return;
      try {
        const data = await getInflationData(masterCurrency.code);
        setInflationData(data);
      } catch (error) {
        console.error('Error loading inflation data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInflationData();
  }, [masterCurrency]);

  const { assetMetrics, totals } = useMemo(() => {
    const metrics = assets
      .filter(asset => asset.status === 'active')
      .map(asset => {
        const assetType = ASSET_TYPES.find(type => type.id === asset.type);
        const latestValue = asset.values?.[0]?.masterCurrencyValue || asset.masterCurrencyValue;
        const valueChange = latestValue - asset.masterCurrencyValue;
        const percentageChange = ((valueChange) / asset.masterCurrencyValue) * 100;
        
        // Calculate inflation-adjusted values
        const inflationAdjustedInitial = calculateInflationAdjustedValue(
          asset.masterCurrencyValue,
          asset.purchaseDate,
          new Date().toISOString(),
          inflationData
        );
        
        const inflationAdjustedCurrent = calculateInflationAdjustedValue(
          latestValue,
          asset.values?.[0]?.date || asset.purchaseDate,
          new Date().toISOString(),
          inflationData
        );

        const realValueChange = inflationAdjustedCurrent - inflationAdjustedInitial;
        const realPercentageChange = ((realValueChange) / inflationAdjustedInitial) * 100;
        
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

        // Calculate cumulative inflation rate
        const cumulativeInflation = ((inflationAdjustedInitial - asset.masterCurrencyValue) / asset.masterCurrencyValue) * 100;

        return {
          asset,
          assetType,
          metrics: {
            initialValue: asset.masterCurrencyValue,
            currentValue: latestValue,
            valueChange,
            percentageChange,
            inflationAdjustedInitial,
            inflationAdjustedCurrent,
            realValueChange,
            realPercentageChange,
            cumulativeInflation,
            monthlyIncome,
            totalIncome,
            totalReturn,
            totalReturnPercentage,
          },
        };
      })
      .sort((a, b) => b.metrics.totalReturn - a.metrics.totalReturn);

    // Calculate totals
    const totals = metrics.reduce((acc, { metrics }) => ({
      initialValue: acc.initialValue + metrics.initialValue,
      currentValue: acc.currentValue + metrics.currentValue,
      valueChange: acc.valueChange + metrics.valueChange,
      inflationAdjustedCurrent: acc.inflationAdjustedCurrent + metrics.inflationAdjustedCurrent,
      realValueChange: acc.realValueChange + metrics.realValueChange,
      monthlyIncome: acc.monthlyIncome + metrics.monthlyIncome,
      totalIncome: acc.totalIncome + metrics.totalIncome,
      totalReturn: acc.totalReturn + metrics.totalReturn,
    }), {
      initialValue: 0,
      currentValue: 0,
      valueChange: 0,
      inflationAdjustedCurrent: 0,
      realValueChange: 0,
      monthlyIncome: 0,
      totalIncome: 0,
      totalReturn: 0,
    });

    // Calculate total percentages
    totals.percentageChange = totals.initialValue > 0 
      ? (totals.valueChange / totals.initialValue) * 100 
      : 0;
    totals.realPercentageChange = totals.initialValue > 0 
      ? (totals.realValueChange / totals.initialValue) * 100 
      : 0;
    totals.totalReturnPercentage = totals.initialValue > 0 
      ? (totals.totalReturn / totals.initialValue) * 100 
      : 0;

    return { assetMetrics: metrics, totals };
  }, [assets, inflationData]);

  const formatCurrency = (value: number) => {
    return `${masterCurrency?.symbol}${Math.round(value).toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Purchase Info</TableHead>
            <TableHead>Current Value</TableHead>
            <TableHead>Nominal Change</TableHead>
            <TableHead>Real Value</TableHead>
            <TableHead>Real Change</TableHead>
            <TableHead>Income</TableHead>
            <TableHead>Total Return</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assetMetrics.map(({ asset, assetType, metrics }) => (
            <TableRow key={asset.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-gray-500">{assetType?.name}</p>
                </div>
              </TableCell>
              
              <TableCell>
                <div>
                  <p>{formatCurrency(metrics.initialValue)}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(asset.purchaseDate), 'PP')}
                  </p>
                </div>
              </TableCell>
              
              <TableCell>
                <div>
                  <p>{formatCurrency(metrics.currentValue)}</p>
                  {asset.values?.[0] && (
                    <p className="text-sm text-gray-500">
                      {format(new Date(asset.values[0].date), 'PP')}
                    </p>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className={metrics.valueChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  <div className="flex items-center">
                    {metrics.valueChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {formatPercentage(metrics.percentageChange)}
                  </div>
                  <p>{formatCurrency(metrics.valueChange)}</p>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p>{formatCurrency(metrics.inflationAdjustedCurrent)}</p>
                  <p className="text-sm text-blue-500">
                    Inflation: {formatPercentage(metrics.cumulativeInflation)}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className={metrics.realValueChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  <div className="flex items-center">
                    {metrics.realValueChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {formatPercentage(metrics.realPercentageChange)}
                  </div>
                  <p>{formatCurrency(metrics.realValueChange)}</p>
                </div>
              </TableCell>
              
              <TableCell>
                <div>
                  <p className="text-sm text-gray-500">Monthly:</p>
                  <p>{formatCurrency(metrics.monthlyIncome)}</p>
                  <p className="text-sm text-gray-500 mt-1">Total:</p>
                  <p className="text-green-600">{formatCurrency(metrics.totalIncome)}</p>
                </div>
              </TableCell>
              
              <TableCell>
                <div className={metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                  <div className="flex items-center">
                    {metrics.totalReturn >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {formatPercentage(metrics.totalReturnPercentage)}
                  </div>
                  <p>{formatCurrency(metrics.totalReturn)}</p>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {/* Summary Row */}
          <TableRow className="font-bold bg-muted/50">
            <TableCell>Portfolio Total</TableCell>
            <TableCell>{formatCurrency(totals.initialValue)}</TableCell>
            <TableCell>{formatCurrency(totals.currentValue)}</TableCell>
            <TableCell>
              <div className={totals.valueChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                <div className="flex items-center">
                  {totals.valueChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(totals.percentageChange)}
                </div>
                <p>{formatCurrency(totals.valueChange)}</p>
              </div>
            </TableCell>
            <TableCell>{formatCurrency(totals.inflationAdjustedCurrent)}</TableCell>
            <TableCell>
              <div className={totals.realValueChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                <div className="flex items-center">
                  {totals.realValueChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(totals.realPercentageChange)}
                </div>
                <p>{formatCurrency(totals.realValueChange)}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm text-gray-500">Monthly:</p>
                <p>{formatCurrency(totals.monthlyIncome)}</p>
                <p className="text-sm text-gray-500 mt-1">Total:</p>
                <p className="text-green-600">{formatCurrency(totals.totalIncome)}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className={totals.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                <div className="flex items-center">
                  {totals.totalReturn >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(totals.totalReturnPercentage)}
                </div>
                <p>{formatCurrency(totals.totalReturn)}</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}