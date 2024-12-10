import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Asset, AssetValue } from '../../types/asset';
import { useCurrency } from '../../contexts/CurrencyContext';
import { formatDate } from '../../utils/date';

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
  '#84CC16'
];

interface PerformanceAnalysisProps {
  assets: Asset[];
}

interface ChartData {
  date: string;
  totalValue: number;
  [key: string]: number | string;
}

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ assets }) => {
  const { masterCurrency } = useCurrency();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistoricalValues = async () => {
      if (assets.length === 0) {
        setChartData([]);
        setLoading(false);
        return;
      }

      const assetValues: { [key: string]: AssetValue[] } = {};
      const allDates = new Set<string>();

      // Fetch historical values for each asset
      for (const asset of assets) {
        const valuesQuery = query(
          collection(db, 'assetValues'),
          where('assetId', '==', asset.id)
        );
        const snapshot = await getDocs(valuesQuery);
        const values: AssetValue[] = [];
        snapshot.forEach((doc) => {
          const value = { id: doc.id, ...doc.data() } as AssetValue;
          values.push(value);
          allDates.add(value.date);
        });
        assetValues[asset.id] = values;
      }

      // Create chart data
      const sortedDates = Array.from(allDates).sort();
      const data: ChartData[] = sortedDates.map(date => {
        const dataPoint: ChartData = {
          date,
          totalValue: 0
        };

        assets.forEach(asset => {
          const value = assetValues[asset.id]?.find(v => v.date === date);
          if (value) {
            dataPoint[asset.name] = value.masterCurrencyValue;
            dataPoint.totalValue += value.masterCurrencyValue;
          }
        });

        return dataPoint;
      });

      setChartData(data);
      setLoading(false);
    };

    loadHistoricalValues();
  }, [assets]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: masterCurrency?.code || 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-[400px] bg-gray-100 dark:bg-gray-900 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Performance Over Time</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalValue"
              name="Total Value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
            {assets.map((asset, index) => (
              <Line
                key={asset.id}
                type="monotone"
                dataKey={asset.name}
                name={asset.name}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={1.5}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;