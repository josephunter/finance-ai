import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Asset, AssetIncome, ASSET_TYPES } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { getAssetIncomes } from '@/lib/services/asset-income-service';
import { calculateAccumulatedIncome, calculateTotalAccumulatedIncome } from '@/lib/utils/income';
import { AddIncomeDialog } from './AddIncomeDialog';
import { EditIncomeDialog } from './EditIncomeDialog';
import { format } from 'date-fns';
import { Pencil, PlusCircle } from 'lucide-react';

interface AssetIncomeHistoryProps {
  asset: Asset;
}

export function AssetIncomeHistory({ asset }: AssetIncomeHistoryProps) {
  const [incomes, setIncomes] = useState<AssetIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIncome, setEditingIncome] = useState<AssetIncome | null>(null);
  const { settings } = useUserSettings();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);
  const assetType = ASSET_TYPES.find(type => type.id === asset.type);

  useEffect(() => {
    loadIncomes();
  }, [asset.id]);

  const loadIncomes = async () => {
    try {
      const assetIncomes = await getAssetIncomes(asset.id);
      setIncomes(assetIncomes);
    } catch (error) {
      console.error('Error loading asset incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalMonthlyIncome = () => {
    return incomes.reduce((total, income) => {
      if (income.status !== 'active') return total;
      const amount = income.masterCurrencyAmount;
      return total + (income.frequency === 'yearly' ? amount / 12 : amount);
    }, 0);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAccumulatedIncome = calculateTotalAccumulatedIncome(incomes);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Income Streams</CardTitle>
        <AddIncomeDialog asset={asset} onIncomeAdded={loadIncomes} />
      </CardHeader>
      <CardContent>
        {incomes.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No income streams added yet
          </p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomes.map((income) => {
                const incomeType = assetType?.incomeTypes.find(t => t.id === income.type);
                const currency = CURRENCIES.find(c => c.code === income.currency);
                const accumulatedIncome = calculateAccumulatedIncome(income);
                
                return (
                  <Card key={income.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{incomeType?.name}</h4>
                            <p className="text-sm text-gray-500">
                              {income.frequency.charAt(0).toUpperCase() + income.frequency.slice(1)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingIncome(income)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              income.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {income.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Amount:</span>
                            <span className="font-medium">
                              {currency?.symbol}{income.amount.toLocaleString()} {currency?.code}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">In {masterCurrency?.code}:</span>
                            <span className="font-medium">
                              {masterCurrency?.symbol}{income.masterCurrencyAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Accumulated:</span>
                            <span className="font-medium text-green-600">
                              {masterCurrency?.symbol}{Math.round(accumulatedIncome).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Start Date:</span>
                            <span>{format(new Date(income.startDate), 'PP')}</span>
                          </div>
                          {income.endDate && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">End Date:</span>
                              <span>{format(new Date(income.endDate), 'PP')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid gap-4">
              <Card className="bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Monthly Income:</span>
                    <span className="text-lg font-bold">
                      {masterCurrency?.symbol}
                      {Math.round(getTotalMonthlyIncome()).toLocaleString()}
                      {' '}
                      {masterCurrency?.code}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Accumulated Income:</span>
                    <span className="text-lg font-bold text-green-600">
                      {masterCurrency?.symbol}
                      {Math.round(totalAccumulatedIncome).toLocaleString()}
                      {' '}
                      {masterCurrency?.code}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>

      <EditIncomeDialog
        asset={asset}
        income={editingIncome}
        open={!!editingIncome}
        onOpenChange={(open) => !open && setEditingIncome(null)}
        onIncomeUpdated={loadIncomes}
      />
    </Card>
  );
}