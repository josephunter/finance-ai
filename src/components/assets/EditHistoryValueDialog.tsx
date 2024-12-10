import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AssetValue } from '../../types/asset';
import { CURRENCIES, useCurrency } from '../../contexts/CurrencyContext';
import { convertCurrency } from '../../utils/currency';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { formatDate } from '../../utils/date';

interface EditHistoryValueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  value: AssetValue;
}

const EditHistoryValueDialog: React.FC<EditHistoryValueDialogProps> = ({ isOpen, onClose, value }) => {
  const { masterCurrency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: value.date,
    value: value.value.toString(),
    currency: value.currency
  });
  const [error, setError] = useState('');

  if (!isOpen || !masterCurrency) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newValue = parseFloat(formData.value);
      if (isNaN(newValue)) {
        throw new Error('Invalid value');
      }

      // Convert to master currency if different
      let masterCurrencyValue = newValue;
      if (formData.currency !== masterCurrency.code) {
        masterCurrencyValue = await convertCurrency(
          newValue,
          formData.currency,
          masterCurrency.code,
          formData.date
        );
      }

      const valueRef = doc(db, 'assetValues', value.id!);
      await updateDoc(valueRef, {
        date: formData.date,
        value: newValue,
        currency: formData.currency,
        masterCurrencyValue,
        masterCurrency: masterCurrency.code
      });

      // If this is the latest value, update the asset's current value
      const assetRef = doc(db, 'assets', value.assetId);
      await updateDoc(assetRef, {
        currentValue: masterCurrencyValue
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update value');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value: inputValue } = e.target;
    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Historical Value
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
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value
              </label>
              <input
                type="number"
                name="value"
                required
                step="0.01"
                min="0"
                value={formData.value}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select
                name="currency"
                required
                value={formData.currency}
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
              {loading ? 'Updating...' : 'Update Value'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHistoryValueDialog;