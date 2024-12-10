import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, LineChart } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Asset } from '../../types/asset';
import { calculateInflationAdjustedValue } from '../../utils/inflation';

const AnalyticsSummary: React.FC = () => {
  const { user } = useAuth();
  const { masterCurrency } = useCurrency();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    monthlyChange: 0,
    yearlyChange: 0,
    inflationAdjustedValue: 0
  });

  useEffect(() => {
    if (!user || !masterCurrency) return;

    const assetsQuery = query(
      collection(db, 'assets'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(assetsQuery, async (snapshot) => {
      const assetList: Asset[] = [];
      snapshot.forEach((doc) => {
        assetList.push({ id: doc.id, ...doc.data() } as Asset);
      });
      setAssets(assetList);

      // Calculate metrics
      const totalValue = assetList.reduce((sum, asset) => sum + asset.currentValue, 0);
      const totalPurchaseValue = assetList.reduce((sum, asset) => sum + asset.masterCurrencyValue, 0);
      
      // Calculate total inflation adjusted value
      let totalInflationAdjusted = 0;
      for (const asset of assetList) {
        const adjustedValue = await calculateInflationAdjustedValue(
          asset.masterCurrencyValue,
          asset.purchaseDate,
          masterCurrency.code
        );
        totalInflationAdjusted += adjustedValue;
      }

      setMetrics({
        totalValue,
        monthlyChange: ((totalValue - totalPurchaseValue) / totalPurchaseValue) * 100,
        yearlyChange: ((totalValue - totalPurchaseValue) / totalPurchaseValue) * 100 * 12,
        inflationAdjustedValue: totalInflationAdjusted
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, masterCurrency]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: masterCurrency?.code || 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Portfolio Value</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(metrics.totalValue)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Change</p>
            <p className={`text-2xl font-semibold ${
              metrics.monthlyChange >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatPercentage(metrics.monthlyChange)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${
            metrics.monthlyChange >= 0 
              ? 'bg-green-100 dark:bg-green-900' 
              : 'bg-red-100 dark:bg-red-900'
          }`}>
            {metrics.monthlyChange >= 0 ? (
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Yearly Performance</p>
            <p className={`text-2xl font-semibold ${
              metrics.yearlyChange >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatPercentage(metrics.yearlyChange)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${
            metrics.yearlyChange >= 0 
              ? 'bg-green-100 dark:bg-green-900' 
              : 'bg-red-100 dark:bg-red-900'
          }`}>
            <LineChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inflation Adjusted Value</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(metrics.inflationAdjustedValue)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatPercentage(((metrics.totalValue - metrics.inflationAdjustedValue) / metrics.inflationAdjustedValue) * 100)} vs Inflation
            </p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSummary;