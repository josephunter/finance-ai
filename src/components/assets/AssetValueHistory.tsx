import { useState } from 'react';
import { Asset, AssetValue } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { deleteAssetValue } from '@/lib/services/asset-value-service';
import { useToast } from '@/hooks/use-toast';
import { TrendingDown, TrendingUp, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useInflationData } from '@/hooks/useInflationData';
import { calculateInflationAdjustedValue, calculateInflationBetweenDates } from '@/lib/utils/inflation';
import { MonthlyInflationDialog } from '@/components/analytics/MonthlyInflationDialog';

interface AssetValueHistoryProps {
  values: AssetValue[];
  asset: Asset;
  onValueDeleted?: () => void;
}

export function AssetValueHistory({ values, asset, onValueDeleted }: AssetValueHistoryProps) {
  const { settings } = useUserSettings();
  const { toast } = useToast();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);
  const { inflationData, loading: loadingInflation } = useInflationData(settings.masterCurrency?.code);
  const [selectedInflationData, setSelectedInflationData] = useState<{
    monthlyRates: { date: string; rate: number }[];
    cumulativeRate: number;
    startDate: string;
    endDate: string;
  } | null>(null);

  const handleDeleteValue = async (valueId: string) => {
    try {
      await deleteAssetValue(valueId);
      toast({
        title: 'Success',
        description: 'Asset value has been deleted successfully',
      });
      onValueDeleted?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete asset value',
        variant: 'destructive',
      });
    }
  };

  const handleShowInflationDetails = (startDate: Date, endDate: Date) => {
    if (!inflationData) return;
    
    const { monthlyRates, cumulativeRate } = calculateInflationBetweenDates(
      startDate,
      endDate,
      inflationData
    );

    setSelectedInflationData({
      monthlyRates,
      cumulativeRate,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  // If no values, show initial purchase value
  if (values.length === 0) {
    const initialInflationData = loadingInflation ? null : calculateInflationBetweenDates(
      new Date(asset.purchaseDate),
      new Date(),
      inflationData
    );

    const initialRealValue = loadingInflation ? null : calculateInflationAdjustedValue(
      asset.masterCurrencyValue,
      new Date(asset.purchaseDate),
      new Date(),
      inflationData
    );

    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Initial Value</h4>
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Purchase Value</p>
              <p className="text-lg font-semibold">
                {masterCurrency?.symbol}
                {asset.masterCurrencyValue.toLocaleString()} 
                {masterCurrency?.code}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(asset.purchaseDate), 'PP')}
              </p>
            </div>

            {!loadingInflation && initialInflationData && initialRealValue && (
              <div>
                <p className="text-sm text-gray-500">Real Value</p>
                <p className="text-lg font-semibold">
                  {masterCurrency?.symbol}
                  {Math.round(initialRealValue).toLocaleString()}
                  {' '}
                  {masterCurrency?.code}
                </p>
                <Button
                  variant="ghost"
                  className="text-sm text-blue-500 p-0 h-auto hover:text-blue-700"
                  onClick={() => handleShowInflationDetails(
                    new Date(asset.purchaseDate),
                    new Date()
                  )}
                >
                  Inflation: {initialInflationData.cumulativeRate > 0 ? '+' : ''}
                  {initialInflationData.cumulativeRate.toFixed(2)}%
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const latestValue = values[0];
  const initialValue = {
    masterCurrencyValue: asset.masterCurrencyValue,
    date: asset.purchaseDate
  };
  
  const valueChange = latestValue.masterCurrencyValue - initialValue.masterCurrencyValue;
  const percentageChange = (valueChange / initialValue.masterCurrencyValue) * 100;

  const isPositive = valueChange >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

  // Calculate inflation-adjusted values
  const latestInflationData = loadingInflation ? null : calculateInflationBetweenDates(
    new Date(asset.purchaseDate),
    new Date(latestValue.date),
    inflationData
  );

  const latestRealValue = loadingInflation ? null : calculateInflationAdjustedValue(
    asset.masterCurrencyValue,
    new Date(asset.purchaseDate),
    new Date(latestValue.date),
    inflationData
  );

  // Compare current value with inflation-adjusted value
  const performanceVsInflation = latestValue.masterCurrencyValue - (latestRealValue || 0);
  const performanceVsInflationPercentage = ((latestValue.masterCurrencyValue - (latestRealValue || 0)) / (latestRealValue || 1)) * 100;
  const beatsInflation = performanceVsInflation >= 0;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Latest Value</h4>
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nominal Value */}
          <div>
            <p className="text-sm text-gray-500">Current Value</p>
            <p className={`text-lg font-semibold ${beatsInflation ? 'text-green-600' : 'text-red-600'}`}>
              {masterCurrency?.symbol}
              {latestValue.masterCurrencyValue.toLocaleString()} 
              {masterCurrency?.code}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(latestValue.date), 'PP')}
            </p>
          </div>

          {/* Change from Initial */}
          <div>
            <p className="text-sm text-gray-500">Nominal Change</p>
            <div className={`flex items-center ${trendColor}`}>
              <TrendIcon className="h-5 w-5 mr-1" />
              <p className="text-lg font-semibold">
                {percentageChange >= 0 ? '+' : ''}
                {percentageChange.toFixed(2)}%
              </p>
            </div>
            <p className={`text-sm ${trendColor}`}>
              {valueChange >= 0 ? '+' : ''}
              {masterCurrency?.symbol}
              {Math.abs(valueChange).toLocaleString()}
            </p>
          </div>

          {/* Real Value and Inflation */}
          {!loadingInflation && latestInflationData && latestRealValue && (
            <div>
              <p className="text-sm text-gray-500">Real Value (Inflation Adjusted)</p>
              <p className="text-lg font-semibold">
                {masterCurrency?.symbol}
                {Math.round(latestRealValue).toLocaleString()} 
                {masterCurrency?.code}
              </p>
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  className="text-sm text-blue-500 p-0 h-auto hover:text-blue-700"
                  onClick={() => handleShowInflationDetails(
                    new Date(asset.purchaseDate),
                    new Date(latestValue.date)
                  )}
                >
                  Inflation: {latestInflationData.cumulativeRate > 0 ? '+' : ''}
                  {latestInflationData.cumulativeRate.toFixed(2)}%
                </Button>
                <p className={`text-sm ${beatsInflation ? 'text-green-500' : 'text-red-500'}`}>
                  vs Inflation: {performanceVsInflationPercentage >= 0 ? '+' : ''}
                  {performanceVsInflationPercentage.toFixed(2)}%
                  <span className="text-xs ml-1">
                    ({beatsInflation ? 'Outperforming' : 'Underperforming'})
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Value History Table */}
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Master Currency Value</TableHead>
                <TableHead>Real Value</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {values.map((value) => {
                const currency = CURRENCIES.find(c => c.code === value.currency);
                const valueInflationData = loadingInflation ? null : calculateInflationBetweenDates(
                  new Date(asset.purchaseDate),
                  new Date(value.date),
                  inflationData
                );
                const realValue = loadingInflation ? null : calculateInflationAdjustedValue(
                  asset.masterCurrencyValue,
                  new Date(asset.purchaseDate),
                  new Date(value.date),
                  inflationData
                );

                const valuePerformanceVsInflation = realValue ? value.masterCurrencyValue - realValue : 0;
                const valueBeatsInflation = valuePerformanceVsInflation >= 0;

                return (
                  <TableRow key={value.id}>
                    <TableCell>{format(new Date(value.date), 'PP')}</TableCell>
                    <TableCell>
                      {currency?.symbol}{value.value.toLocaleString()} {currency?.code}
                    </TableCell>
                    <TableCell>{value.currency}</TableCell>
                    <TableCell className={valueBeatsInflation ? 'text-green-600' : 'text-red-600'}>
                      {masterCurrency?.symbol}
                      {value.masterCurrencyValue.toLocaleString()} 
                      {masterCurrency?.code}
                    </TableCell>
                    <TableCell>
                      {!loadingInflation && valueInflationData && realValue && (
                        <div>
                          {masterCurrency?.symbol}
                          {Math.round(realValue).toLocaleString()}
                          <Button
                            variant="ghost"
                            className="text-xs text-blue-500 p-0 h-auto hover:text-blue-700 block"
                            onClick={() => handleShowInflationDetails(
                              new Date(asset.purchaseDate),
                              new Date(value.date)
                            )}
                          >
                            Inflation: {valueInflationData.cumulativeRate > 0 ? '+' : ''}
                            {valueInflationData.cumulativeRate.toFixed(2)}%
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {!loadingInflation && realValue && (
                        <div className={`text-sm ${valueBeatsInflation ? 'text-green-500' : 'text-red-500'}`}>
                          {valueBeatsInflation ? 'Outperforming' : 'Underperforming'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Value</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this value? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteValue(value.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedInflationData && (
        <MonthlyInflationDialog
          open={!!selectedInflationData}
          onOpenChange={(open) => !open && setSelectedInflationData(null)}
          monthlyRates={selectedInflationData.monthlyRates}
          cumulativeRate={selectedInflationData.cumulativeRate}
          startDate={selectedInflationData.startDate}
          endDate={selectedInflationData.endDate}
        />
      )}
    </div>
  );
}