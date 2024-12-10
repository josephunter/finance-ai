import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { AssetValue } from '../../types/asset';
import { formatDate } from '../../utils/date';
import EditHistoryValueDialog from './EditHistoryValueDialog';
import ConfirmDialog from '../common/ConfirmDialog';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AssetValueChart from './AssetValueChart';

interface AssetHistoryListProps {
  values: AssetValue[];
  assetId: string;
}

const AssetHistoryList: React.FC<AssetHistoryListProps> = ({ values, assetId }) => {
  const { masterCurrency } = useCurrency();
  const [selectedValue, setSelectedValue] = useState<AssetValue | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const calculateChangePercentage = (currentValue: number, previousValue: number): string => {
    const change = ((currentValue - previousValue) / previousValue) * 100;
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

  const handleEdit = (value: AssetValue) => {
    setSelectedValue(value);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (value: AssetValue) => {
    setSelectedValue(value);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedValue?.id) return;

    try {
      await deleteDoc(doc(db, 'assetValues', selectedValue.id));

      // If this was the latest value, update the asset's current value to the previous value
      const sortedValues = [...values].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      if (sortedValues[0].id === selectedValue.id && sortedValues.length > 1) {
        const assetRef = doc(db, 'assets', assetId);
        await updateDoc(assetRef, {
          currentValue: sortedValues[1].masterCurrencyValue
        });
      }
    } catch (error) {
      console.error('Error deleting value:', error);
    }
  };

  // Sort values by date in descending order
  const sortedValues = [...values].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!masterCurrency) return null;

  return (
    <>
      <div className="pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-900">
        <AssetValueChart values={values} currency={masterCurrency.code} />
        
        <table className="min-w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value ({masterCurrency.code})</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedValues.map((value, index) => {
              const previousValue = index < sortedValues.length - 1 ? sortedValues[index + 1] : null;
              const changePercentage = previousValue 
                ? calculateChangePercentage(value.masterCurrencyValue, previousValue.masterCurrencyValue)
                : '+0.00%';
              const changeColorClass = getChangeColor(changePercentage);

              return (
                <tr key={value.id} className="text-sm">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {formatDate(value.date)}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                    {formatCurrency(value.value, value.currency)}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                    {formatCurrency(value.masterCurrencyValue, value.masterCurrency)}
                  </td>
                  <td className={`px-4 py-2 ${changeColorClass}`}>
                    {value.isInitial ? 'Initial Value' : changePercentage}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleEdit(value)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                      title="Edit Value"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(value)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete Value"
                      disabled={value.isInitial}
                    >
                      <Trash2 className={`h-4 w-4 ${value.isInitial ? 'opacity-50 cursor-not-allowed' : ''}`} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedValue && (
        <>
          <EditHistoryValueDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedValue(null);
            }}
            value={selectedValue}
          />
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedValue(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Historical Value"
            message="Are you sure you want to delete this historical value? This action cannot be undone."
            confirmLabel="Delete"
            isDestructive={true}
          />
        </>
      )}
    </>
  );
};

export default AssetHistoryList;