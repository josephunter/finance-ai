import React from 'react';
import { AssetStatus, ASSET_STATUS } from '../../types/asset';

interface AssetStatusBadgeProps {
  status: AssetStatus;
}

const AssetStatusBadge: React.FC<AssetStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: AssetStatus): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {ASSET_STATUS[status]}
    </span>
  );
};

export default AssetStatusBadge;