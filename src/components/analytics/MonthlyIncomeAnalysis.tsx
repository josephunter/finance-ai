import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Asset, AssetIncome } from '../../types/asset';
import { useCurrency } from '../../contexts/CurrencyContext';
import { addMonths, format, startOfMonth, endOfMonth, isFuture } from 'date-fns';

interface MonthlyIncomeAnalysisProps {
  assets: Asset[];
}

interface MonthlyData {
  month: string;
  income: number;
  projected: number;
}

const MonthlyIncomeAnalysis: React.FC<MonthlyIncomeAnalysisProps> = ({ assets }) => {
  const { masterCurrency } = useCurrency();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncomeData = async () => {
      if (assets.length === 0) {
        setMonthlyData([]);
        setLoading(false);
        return;
      }

      const assetIds = assets.map(asset => asset.id);
      const incomesQuery = query(
        collection(db, 'assetIncomes'),
        where('assetId', 'in', assetIds)
      );

      const snapshot = await getDocs(incomesQuery);
      const incomes: AssetIncome[] = [];
      snapshot.forEach((doc) => {
        incomes.push({ id: doc.id, ...doc.data() } as AssetIncome);
      });

      // Generate data for the next 12 months
      const data: MonthlyData[] = [];
      const today = new Date();
      
      for (let i = 0; i < 12; i++) {
        const currentMonth = addMonths(today, i);
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const monthLabel = format(currentMonth, 'MMM yyyy');

        let monthlyIncome = 0;
        let projectedIncome = 0;

        incomes.forEach(income => {
          const startDate = new Date(income.startDate);
          const endDate = income.endDate ? new Date(income.endDate) : null;

          // Skip if start date is in the future for actual income
          if (!isFuture(startDate) && (!endDate || endDate >= monthStart) && startDate <= monthEnd) {
            const amount = income.masterCurrencyAmount;
            
            if (income.frequency === 'monthly') {
              monthlyIncome += amount;
            } else if (income.frequency === 'yearly') {
              monthlyIncome += amount / 12;
            }
          }

          // Calculate projected income (including future income streams)
          if (!endDate || endDate >= monthStart) {
            const amount = income.masterCurrencyAmount;
            
            if (income.frequency === 'monthly') {
              projectedIncome += amount;
            } else if (income.frequency === 'yearly') {
              projectedIncome += amount / 12;
            }
          }
        });

        data.push({
          month: monthLabel,
          income: Math.max(0, monthlyIncome), // Ensure income is never negative
          projected: Math.max(0, projectedIncome) // Ensure projected income is never negative
        });
      }

      setMonthlyData(data);
      setLoading(false);
    };

    loadIncomeData();
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
            {label}
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
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Income Analysis</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Actual Income" fill="#3B82F6" />
            <Bar dataKey="projected" name="Projected Income" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyIncomeAnalysis;