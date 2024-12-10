import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AnalyticsSummary from '../components/analytics/AnalyticsSummary';
import AssetDistribution from '../components/analytics/AssetDistribution';
import PerformanceAnalysis from '../components/analytics/PerformanceAnalysis';
import MonthlyIncomeAnalysis from '../components/analytics/MonthlyIncomeAnalysis';
import RiskMetrics from '../components/analytics/RiskMetrics';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Asset } from '../types/asset';
import { useState, useEffect } from 'react';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);

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
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Detailed analysis and insights of your financial assets
          </p>
        </div>
        
        <AnalyticsSummary />
        <RiskMetrics assets={assets} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetDistribution assets={assets} />
          <PerformanceAnalysis assets={assets} />
        </div>

        <MonthlyIncomeAnalysis assets={assets} />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;