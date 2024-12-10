import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Archive, Wallet } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Asset, AssetIncome } from '../../types/asset';

const AssetsSummary: React.FC = () => {
  const { user } = useAuth();
  const { masterCurrency } = useCurrency();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [incomes, setIncomes] = useState<AssetIncome[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const assetsQuery = query(
      collection(db, 'assets'),
      where('userId', '==', user.uid)
    );

    const unsubscribeAssets = onSnapshot(assetsQuery, (snapshot) => {
      const assetList: Asset[] = [];
      snapshot.forEach((doc) => {
        assetList.push({ id: doc.id, ...doc.data() } as Asset);
      });
      setAssets(assetList);
      setLoading(false);
    });

    return () => {
      unsubscribeAssets();
    };
  }, [user]);

  // Fetch incomes only for user's assets
  useEffect(() => {
    if (!user || assets.length === 0) return;

    const assetIds = assets.map(asset => asset.id);
    const incomesQuery = query(
      collection(db, 'assetIncomes'),
      where('assetId', 'in', assetIds)
    );

    const unsubscribeIncomes = onSnapshot(incomesQuery, (snapshot) => {
      const incomeList: AssetIncome[] = [];
      snapshot.forEach((doc) => {
        incomeList.push({ id: doc.id, ...doc.data() } as AssetIncome);
      });
      setIncomes(incomeList);
    });

    return () => {
      unsubscribeIncomes();
    };
  }, [user, assets]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: masterCurrency?.code || 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate total assets value
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalPurchaseValue = assets.reduce((sum, asset) => sum + asset.masterCurrencyValue, 0);

  // Calculate total change percentage
  const totalChangePercentage = assets.reduce((sum, asset) => {
    const changePercentage = ((asset.currentValue - asset.masterCurrencyValue) / asset.masterCurrencyValue) * 100;
    return sum + changePercentage;
  }, 0) / (assets.length || 1); // Avoid division by zero

  // Count active and inactive assets
  const activeAssets = assets.filter(asset => asset.status === 'active').length;
  const inactiveAssets = assets.filter(asset => asset.status === 'inactive').length;

  // Calculate income totals
  const calculateIncomeTotals = () => {
    const now = new Date();
    let monthlyIncome = 0;
    let totalCollectedIncome = 0;

    incomes.forEach(income => {
      const startDate = new Date(income.startDate);
      const endDate = income.endDate ? new Date(income.endDate) : now;

      // Calculate monthly income for active income streams
      if (!income.endDate || endDate > now) {
        if (income.frequency === 'monthly') {
          monthlyIncome += income.masterCurrencyAmount;
        } else if (income.frequency === 'yearly') {
          monthlyIncome += income.masterCurrencyAmount / 12;
        }
      }

      // Calculate total collected income
      const monthsDiff = (Math.min(now.getTime(), endDate.getTime()) - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (income.frequency === 'monthly') {
        totalCollectedIncome += income.masterCurrencyAmount * monthsDiff;
      } else if (income.frequency === 'yearly') {
        totalCollectedIncome += (income.masterCurrencyAmount / 12) * monthsDiff;
      }
    });

    return { monthlyIncome, totalCollectedIncome };
  };

  const { monthlyIncome, totalCollectedIncome } = calculateIncomeTotals();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets Value</p>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalValue)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Purchase: {formatCurrency(totalPurchaseValue)}
              </p>
            </div>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Change</p>
            <p className={`text-2xl font-semibold ${
              totalChangePercentage >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {totalChangePercentage >= 0 ? '+' : ''}{totalChangePercentage.toFixed(2)}%
            </p>
          </div>
          <div className={`p-3 rounded-full ${
            totalChangePercentage >= 0 
              ? 'bg-green-100 dark:bg-green-900' 
              : 'bg-red-100 dark:bg-red-900'
          }`}>
            {totalChangePercentage >= 0 ? (
              <TrendingUp className={`h-6 w-6 ${
                totalChangePercentage >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`} />
            ) : (
              <TrendingDown className={`h-6 w-6 ${
                totalChangePercentage >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`} />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Income Summary</p>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(monthlyIncome)}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> /month</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total: {formatCurrency(totalCollectedIncome)}
              </p>
            </div>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Asset Count</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {activeAssets}
              </p>
              {inactiveAssets > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  (+{inactiveAssets} inactive)
                </p>
              )}
            </div>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Archive className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsSummary;