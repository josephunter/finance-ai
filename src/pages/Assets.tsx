import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AssetList from '../components/assets/AssetList';

const Assets: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assets</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and track your financial assets
          </p>
        </div>
        
        <AssetList />
      </div>
    </DashboardLayout>
  );
};

export default Assets;