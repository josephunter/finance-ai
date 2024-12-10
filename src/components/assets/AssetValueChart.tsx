import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AssetValue } from '../../types/asset';
import { formatDate } from '../../utils/date';

interface AssetValueChartProps {
  values: AssetValue[];
  currency: string;
}

const AssetValueChart: React.FC<AssetValueChartProps> = ({ values, currency }) => {
  // Sort values by date and prepare data for the chart
  const chartData = [...values]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(value => ({
      date: value.date,
      value: value.masterCurrencyValue,
      formattedDate: formatDate(value.date),
      formattedValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(value.masterCurrencyValue)
    }));

  const formatYAxis = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.formattedDate}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
            {data.formattedValue}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fill: '#9CA3AF' }}
            tickLine={{ stroke: '#4B5563' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: '#9CA3AF' }}
            tickLine={{ stroke: '#4B5563' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#2563EB' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetValueChart;