import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Asset, ASSET_TYPES } from '../../types/asset';
import { useCurrency } from '../../contexts/CurrencyContext';

interface AssetDistributionProps {
  assets: Asset[];
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
  '#84CC16'
];

const AssetDistribution: React.FC<AssetDistributionProps> = ({ assets }) => {
  const { masterCurrency } = useCurrency();

  const distributionData = useMemo(() => {
    const distribution = Object.entries(ASSET_TYPES).map(([type, label]) => {
      const totalValue = assets
        .filter(asset => asset.type === type && asset.status === 'active')
        .reduce((sum, asset) => sum + asset.currentValue, 0);
      return {
        name: label,
        value: totalValue
      };
    }).filter(item => item.value > 0);

    // Sort by value descending
    return distribution.sort((a, b) => b.value - a.value);
  }, [assets]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: masterCurrency?.code || 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / assets.reduce((sum, asset) => sum + asset.currentValue, 0)) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Asset Distribution</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distributionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              labelLine={true}
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetDistribution;