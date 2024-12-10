import React from 'react';
import { Search } from 'lucide-react';
import { ASSET_TYPES, ASSET_STATUS, AssetType, AssetStatus } from '../../types/asset';

interface AssetFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTypes: AssetType[];
  onTypeChange: (type: AssetType) => void;
  selectedStatuses: AssetStatus[];
  onStatusChange: (status: AssetStatus) => void;
}

const AssetFilters: React.FC<AssetFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedTypes,
  onTypeChange,
  selectedStatuses,
  onStatusChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search assets by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Asset Types</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ASSET_TYPES).map(([type, label]) => (
              <button
                key={type}
                onClick={() => onTypeChange(type as AssetType)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTypes.includes(type as AssetType)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:w-48 space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ASSET_STATUS).map(([status, label]) => (
              <button
                key={status}
                onClick={() => onStatusChange(status as AssetStatus)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedStatuses.includes(status as AssetStatus)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetFilters;