import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Asset, AssetType, ASSET_TYPES } from '../../types/asset';
import { CURRENCIES, useCurrency } from '../../contexts/CurrencyContext';
import { convertCurrency } from '../../utils/currency';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface EditAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

const EditAssetDialog: React.FC<EditAssetDialogProps> = ({ isOpen, onClose, asset }) => {
  const { masterCurrency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: asset.name,
    type: asset.type,
    purchaseDate: asset.purchaseDate,
    purchaseValue: asset.purchaseValue.toString(),
    purchaseCurrency: asset.purchaseCurrency,
    description: asset.description || ''
  });
  const [error, setError] = useState('');

  if (!isOpen || !masterCurrency) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const purchaseValue = parseFloat(formData.purchaseValue);
      if (isNaN(purchaseValue)) {
        throw new Error('Invalid purchase value');
      }

      // Convert to master currency if different
      let masterCurrencyValue = purchaseValue;
      if (formData.purchaseCurrency !== masterCurrency.code) {
        masterCurrencyValue = await convertCurrency(
          purchaseValue,
          formData.purchaseCurrency,
          masterCurrency.code,
          formData.purchaseDate
        );
      }

      const assetRef = doc(db, 'assets', asset.id);
      await updateDoc(assetRef, {
        name: formData.name,
        type: formData.type,
        purchaseDate: formData.purchaseDate,
        purchaseValue,
        purchaseCurrency: formData.purchaseCurrency,
        masterCurrencyValue,
        currentValue: masterCurrencyValue, // Reset current value to new purchase value
        description: formData.description
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update asset');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Asset
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Asset Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Asset Type
            </label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {Object.entries(ASSET_TYPES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              required
              value={formData.purchaseDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Purchase Value
              </label>
              <input
                type="number"
                name="purchaseValue"
                required
                step="0.01"
                min="0"
                value={formData.purchaseValue}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select
                name="purchaseCurrency"
                required
                value={formData.purchaseCurrency}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssetDialog;