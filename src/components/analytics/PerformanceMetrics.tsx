import { Card } from '@/components/ui/card';
import { Currency } from '@/types/currency';
import { TrendingUp, TrendingDown, PiggyBank, Coins, LineChart } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: {
    initialValue: number;
    currentValue: number;
    valueChange: number;
    percentageChange: number;
    monthlyIncome: number;
    totalIncome: number;
    totalReturn: number;
    totalReturnPercentage: number;
  };
  currency?: Currency;
}

export function PerformanceMetrics({ metrics, currency }: PerformanceMetricsProps) {
  const formatCurrency = (value: number) => {
    return `${currency?.symbol}${Math.round(value).toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const TrendIcon = metrics.valueChange >= 0 ? TrendingUp : TrendingDown;
  const trendColor = metrics.valueChange >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Current Value</p>
            <p className="text-lg font-semibold mt-1">
              {formatCurrency(metrics.currentValue)}
            </p>
            <div className={`flex items-center text-sm ${trendColor}`}>
              <TrendIcon className="h-4 w-4 mr-1" />
              <span>{formatPercentage(metrics.percentageChange)}</span>
            </div>
          </div>
          <LineChart className="h-4 w-4 text-gray-400" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Monthly Income</p>
            <p className="text-lg font-semibold mt-1">
              {formatCurrency(metrics.monthlyIncome)}
            </p>
            <p className="text-xs text-gray-500">Active income streams</p>
          </div>
          <Coins className="h-4 w-4 text-gray-400" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-lg font-semibold mt-1 text-green-600">
              {formatCurrency(metrics.totalIncome)}
            </p>
            <p className="text-xs text-gray-500">Accumulated to date</p>
          </div>
          <PiggyBank className="h-4 w-4 text-gray-400" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total Return</p>
            <p className="text-lg font-semibold mt-1">
              {formatCurrency(metrics.totalReturn)}
            </p>
            <p className={`text-sm ${metrics.totalReturnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(metrics.totalReturnPercentage)}
            </p>
          </div>
          <TrendingUp className="h-4 w-4 text-gray-400" />
        </div>
      </Card>
    </div>
  );
}