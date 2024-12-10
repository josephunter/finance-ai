import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileSettings from '../components/settings/ProfileSettings';
import CurrencySettings from '../components/settings/CurrencySettings';

const Settings: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <ProfileSettings />
          <CurrencySettings />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;