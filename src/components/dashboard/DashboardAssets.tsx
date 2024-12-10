import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Asset, ASSET_TYPES } from '../../types/asset';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DashboardAssets: React.FC = () => {
  const { user } = useAuth();
  const { masterCurrency } = useCurrency();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const assetsQuery = query(
      collection(db, 'assets'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(assetsQuery, (snapshot) => {
      const assetList: Asset[] = [];
      snapshot.forEach((doc) => {
        assetList.push({ id: doc.id, ...doc.data() } as Asset);
      });
      setAssets(assetList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: masterCurrency?.code || 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateChangePercentage = (currentValue: number, purchaseValue: number): string => {
    const change = ((currentValue - purchaseValue) / purchaseValue) * 100;
    const formattedChange = change.toFixed(2);
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${formattedChange}%`;
  };

  const getChangeColor = (change: string): string => {
    if (change.startsWith('+')) {
      return 'text-green-600 dark:text-green-400';
    } else if (change.startsWith('-')) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  // Prepare data for pie chart
  const pieChartData = Object.entries(ASSET_TYPES).map(([type, label]) => {
    const totalValue = assets
      .filter(asset => asset.type === type && asset.status === 'active')
      .reduce((sum, asset) => sum + asset.currentValue, 0);
    return {
      name: label,
      value: totalValue
    };
  }).filter(item => item.value > 0);

  // Colors for pie chart
  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
    '#84CC16'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assets Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purchase Value</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No assets found
                  </td>
                </tr>
              ) : (
                assets
                  .filter(asset => asset.status === 'active')
                  .map(asset => {
                    const changePercentage = calculateChangePercentage(asset.currentValue, asset.masterCurrencyValue);
                    const changeColorClass = getChangeColor(changePercentage);

                    return (
                      <tr key={asset.id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {asset.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {ASSET_TYPES[asset.type]}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                          {formatCurrency(asset.masterCurrencyValue)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                          {formatCurrency(asset.currentValue)}
                        </td>
                        <td className={`px-6 py-4 text-sm ${changeColorClass} text-right`}>
                          {changePercentage}
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Asset Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAssets;