import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Pencil, Trash2, TrendingUp, Power, DollarSign, MoreVertical } from 'lucide-react';
import { Asset, ASSET_TYPES, AssetValue, AssetIncome } from '../../types/asset';
import { useCurrency } from '../../contexts/CurrencyContext';
import AssetHistoryList from './AssetHistoryList';
import { collection, query, where, onSnapshot, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ConfirmDialog from '../common/ConfirmDialog';
import AssetStatusBadge from './AssetStatusBadge';
import ToggleAssetStatusDialog from './ToggleAssetStatusDialog';
import AssetIncomeDialog from './AssetIncomeDialog';
import { calculateInflationAdjustedValue, calculateInflationImpact } from '../../utils/inflation';

interface AssetRowProps {
  asset: Asset;
  onUpdateValue: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
}

const AssetRow: React.FC<AssetRowProps> = ({ asset, onUpdateValue, onEditAsset }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [historyValues, setHistoryValues] = useState<AssetValue[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const { masterCurrency } = useCurrency();

  // Calculate inflation-adjusted values
  const inflationAdjustedValue = calculateInflationAdjustedValue(
    asset.masterCurrencyValue,
    asset.purchaseDate,
    masterCurrency?.code || 'USD'
  );
  const inflationImpact = calculateInflationImpact(
    asset.currentValue,
    inflationAdjustedValue
  );

  useEffect(() => {
    if (!asset.id) return;

    const q = query(
      collection(db, 'assetIncomes'),
      where('assetId', '==', asset.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let monthly = 0;
      let total = 0;
      const now = new Date();

      snapshot.forEach((doc) => {
        const income = doc.data() as AssetIncome;
        const startDate = new Date(income.startDate);
        const endDate = income.endDate ? new Date(income.endDate) : now;

        // Calculate monthly income
        if (!income.endDate || endDate > now) {
          if (income.frequency === 'monthly') {
            monthly += income.masterCurrencyAmount;
          } else if (income.frequency === 'yearly') {
            monthly += income.masterCurrencyAmount / 12;
          }
        }

        // Calculate total income
        const monthsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (income.frequency === 'monthly') {
          total += income.masterCurrencyAmount * monthsDiff;
        } else if (income.frequency === 'yearly') {
          total += (income.masterCurrencyAmount / 12) * monthsDiff;
        }
      });

      setMonthlyIncome(monthly);
      setTotalIncome(total);
    });

    return () => unsubscribe();
  }, [asset.id]);

  useEffect(() => {
    if (isExpanded) {
      const q = query(
        collection(db, 'assetValues'),
        where('assetId', '==', asset.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const values: AssetValue[] = [];
        snapshot.forEach((doc) => {
          values.push({ id: doc.id, ...doc.data() } as AssetValue);
        });
        setHistoryValues(values);
      });

      return () => unsubscribe();
    }
  }, [asset.id, isExpanded]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-menu')) {
        setShowActionMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    setShowActionMenu(false);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const batch = writeBatch(db);

      // Delete all asset values
      const valuesQuery = query(
        collection(db, 'assetValues'),
        where('assetId', '==', asset.id)
      );
      const valuesSnapshot = await getDocs(valuesQuery);
      valuesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete all asset incomes
      const incomesQuery = query(
        collection(db, 'assetIncomes'),
        where('assetId', '==', asset.id)
      );
      const incomesSnapshot = await getDocs(incomesQuery);
      incomesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete the asset itself
      batch.delete(doc(db, 'assets', asset.id));

      // Commit all deletions in a single batch
      await batch.commit();
    } catch (error) {
      console.error('Error deleting asset:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const calculateChangePercentage = (currentValue: number, purchaseValue: number): string => {
    const change = ((currentValue - purchaseValue) / purchaseValue) * 100;
    const formattedChange = change.toFixed(2);
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${formattedChange}%`;
  };

  const getChangeColor = (change: string): string => {
    if (change.startsWith('+')) {
      return 'text-green-600 dark:text-green-400';
    } else if (change.startsWith('-')) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  const changePercentage = calculateChangePercentage(asset.currentValue, asset.masterCurrencyValue);
  const changeColorClass = getChangeColor(changePercentage);
  const inflationColorClass = getChangeColor(inflationImpact >= 0 ? `+${inflationImpact.toFixed(2)}` : inflationImpact.toFixed(2));

  return (
    <>
      <tr className="group hover:bg-gray-50 dark:hover:bg-gray-900">
        <td className="px-6 py-4 text-sm">
          <div className="flex flex-col">
            <div className="flex items-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-gray-900 dark:text-white font-medium"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                {asset.name}
              </button>
            </div>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {ASSET_TYPES[asset.type]}
              </span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <AssetStatusBadge status={asset.status} />
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
          {formatCurrency(asset.purchaseValue, asset.purchaseCurrency)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
          {formatCurrency(asset.masterCurrencyValue, masterCurrency?.code || 'USD')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
          {formatCurrency(asset.currentValue, masterCurrency?.code || 'USD')}
        </td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${changeColorClass} text-right`}>
          {changePercentage}
        </td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${inflationColorClass} text-right`}>
          <div className="flex flex-col items-end">
            <span>{formatCurrency(inflationAdjustedValue, masterCurrency?.code || 'USD')}</span>
            <span className="text-xs mt-1">
              {inflationImpact >= 0 ? '+' : ''}{inflationImpact.toFixed(2)}%
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
          {formatCurrency(monthlyIncome, masterCurrency?.code || 'USD')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
          {formatCurrency(totalIncome, masterCurrency?.code || 'USD')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
          <div className="action-menu">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionMenu(!showActionMenu);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {showActionMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowActionMenu(false);
                      onUpdateValue(asset);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-3" />
                    Update Value
                  </button>
                  <button
                    onClick={() => {
                      setShowActionMenu(false);
                      setIsIncomeDialogOpen(true);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <DollarSign className="h-4 w-4 mr-3" />
                    Manage Income
                  </button>
                  <button
                    onClick={() => {
                      setShowActionMenu(false);
                      onEditAsset(asset);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-4 w-4 mr-3" />
                    Edit Asset
                  </button>
                  <button
                    onClick={() => {
                      setShowActionMenu(false);
                      setIsStatusDialogOpen(true);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Power className="h-4 w-4 mr-3" />
                    {asset.status === 'active' ? 'Deactivate' : 'Activate'} Asset
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Delete Asset
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={9}>
            <AssetHistoryList values={historyValues} assetId={asset.id} />
          </td>
        </tr>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Asset"
        message="Are you sure you want to delete this asset? This action cannot be undone and will remove all historical values and income records."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        isDestructive={true}
        disabled={isDeleting}
      />

      <ToggleAssetStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        asset={asset}
      />

      <AssetIncomeDialog
        isOpen={isIncomeDialogOpen}
        onClose={() => setIsIncomeDialogOpen(false)}
        asset={asset}
      />
    </>
  );
};

export default AssetRow;