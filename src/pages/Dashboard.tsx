import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AssetsSummary from '../components/dashboard/AssetsSummary';
import DashboardAssets from '../components/dashboard/DashboardAssets';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track and manage your financial assets
          </p>
        </div>
        
        <AssetsSummary />
        <DashboardAssets />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;