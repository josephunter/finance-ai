import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Asset, AssetType, AssetStatus } from '../../types/asset';
import AddAssetDialog from './AddAssetDialog';
import UpdateAssetValueDialog from './UpdateAssetValueDialog';
import EditAssetDialog from './EditAssetDialog';
import { useCurrency } from '../../contexts/CurrencyContext';
import AssetRow from './AssetRow';
import AssetFilters from './AssetFilters';
import { useSort } from '../../hooks/useSort';
import SortableHeader from '../common/SortableHeader';

const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isUpdateValueDialogOpen, setIsUpdateValueDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<AssetType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<AssetStatus[]>([]);

  const { user } = useAuth();
  const { masterCurrency } = useCurrency();
  const { sortedItems, sortConfig, requestSort } = useSort<Asset>(filteredAssets, 'currentValue');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'assets'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const assetList: Asset[] = [];
      snapshot.forEach((doc) => {
        assetList.push({ id: doc.id, ...doc.data() } as Asset);
      });
      setAssets(assetList);
    });

    return () => unsubscribe();
  }, [user]);

  // Filter assets based on search term and selected filters
  useEffect(() => {
    let filtered = [...assets];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(asset => 
        selectedTypes.includes(asset.type)
      );
    }

    // Apply status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(asset => 
        selectedStatuses.includes(asset.status)
      );
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, selectedTypes, selectedStatuses]);

  const handleAddAsset = () => {
    setIsAddDialogOpen(true);
  };

  const handleUpdateValue = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsUpdateValueDialogOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsEditDialogOpen(true);
  };

  const handleTypeChange = (type: AssetType) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleStatusChange = (status: AssetStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Calculate totals
  const totals = sortedItems.reduce((acc, asset) => ({
    purchaseValue: acc.purchaseValue + asset.purchaseValue,
    masterCurrencyValue: acc.masterCurrencyValue + asset.masterCurrencyValue,
    currentValue: acc.currentValue + asset.currentValue,
    monthlyIncome: acc.monthlyIncome + (asset.monthlyIncome || 0),
    totalIncome: acc.totalIncome + (asset.totalIncome || 0)
  }), {
    purchaseValue: 0,
    masterCurrencyValue: 0,
    currentValue: 0,
    monthlyIncome: 0,
    totalIncome: 0
  });

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const calculateTotalChangePercentage = () => {
    if (totals.masterCurrencyValue === 0) return '0.00%';
    const change = ((totals.currentValue - totals.masterCurrencyValue) / totals.masterCurrencyValue) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const totalChangePercentage = calculateTotalChangePercentage();
  const changeColorClass = totalChangePercentage.startsWith('+') 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';

  return (
    <>
      <AssetFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTypes={selectedTypes}
        onTypeChange={handleTypeChange}
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
      />

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Assets</h3>
          <button
            onClick={handleAddAsset}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Asset
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <SortableHeader<Asset>
                    label="Asset Name"
                    sortKey="name"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                  />
                  <SortableHeader<Asset>
                    label="Purchase Value"
                    sortKey="purchaseValue"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="text-right"
                  />
                  <SortableHeader<Asset>
                    label={`Purchase Value (${masterCurrency?.code})`}
                    sortKey="masterCurrencyValue"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="text-right"
                  />
                  <SortableHeader<Asset>
                    label={`Current Value (${masterCurrency?.code})`}
                    sortKey="currentValue"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="text-right"
                  />
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inflation Impact</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monthly Income ({masterCurrency?.code})</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Income ({masterCurrency?.code})</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedItems.length === 0 ? (
                  <tr className="text-gray-500 dark:text-gray-400 text-sm">
                    <td colSpan={9} className="px-6 py-4 text-center">
                      {assets.length === 0 
                        ? "No assets added yet. Click the \"Add Asset\" button to get started."
                        : "No assets match your search criteria."}
                    </td>
                  </tr>
                ) : (
                  <>
                    {sortedItems.map((asset) => (
                      <AssetRow
                        key={asset.id}
                        asset={asset}
                        onUpdateValue={handleUpdateValue}
                        onEditAsset={handleEditAsset}
                      />
                    ))}
                    <tr className="bg-gray-50 dark:bg-gray-900 font-semibold">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        Total ({sortedItems.length} assets)
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">
                        -
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(totals.masterCurrencyValue, masterCurrency?.code || 'USD')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(totals.currentValue, masterCurrency?.code || 'USD')}
                      </td>
                      <td className={`px-6 py-4 text-sm text-right ${changeColorClass}`}>
                        {totalChangePercentage}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">
                        -
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(totals.monthlyIncome, masterCurrency?.code || 'USD')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(totals.totalIncome, masterCurrency?.code || 'USD')}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        -
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddAssetDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAssetAdded={() => setIsAddDialogOpen(false)}
      />

      {selectedAsset && (
        <>
          <UpdateAssetValueDialog
            isOpen={isUpdateValueDialogOpen}
            onClose={() => {
              setIsUpdateValueDialogOpen(false);
              setSelectedAsset(null);
            }}
            asset={selectedAsset}
          />
          <EditAssetDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedAsset(null);
            }}
            asset={selectedAsset}
          />
        </>
      )}
    </>
  );
};

export default AssetList;