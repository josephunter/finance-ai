import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Asset, AssetIncome, INCOME_FREQUENCIES } from '../../types/asset';
import { CURRENCIES, useCurrency } from '../../contexts/CurrencyContext';
import { convertCurrency } from '../../utils/currency';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { formatDate } from '../../utils/date';
import { isAfter } from 'date-fns';

interface AssetIncomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

const AssetIncomeDialog: React.FC<AssetIncomeDialogProps> = ({ isOpen, onClose, asset }) => {
  const { masterCurrency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [incomes, setIncomes] = useState<AssetIncome[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    amount: '',
    currency: masterCurrency?.code || '',
    frequency: 'monthly' as const,
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadIncomes = async () => {
      if (!asset.id) return;

      const q = query(
        collection(db, 'assetIncomes'),
        where('assetId', '==', asset.id)
      );

      const snapshot = await getDocs(q);
      const incomeList: AssetIncome[] = [];
      snapshot.forEach((doc) => {
        incomeList.push({ id: doc.id, ...doc.data() } as AssetIncome);
      });
      setIncomes(incomeList);
    };

    if (isOpen) {
      loadIncomes();
    }
  }, [asset.id, isOpen]);

  if (!isOpen || !masterCurrency) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount)) {
        throw new Error('Invalid amount');
      }

      // For future dates, use current exchange rate
      const conversionDate = isAfter(new Date(formData.startDate), new Date())
        ? undefined // This will make convertCurrency use the latest rate
        : formData.startDate;

      // Convert to master currency if different
      let masterCurrencyAmount = amount;
      if (formData.currency !== masterCurrency.code) {
        masterCurrencyAmount = await convertCurrency(
          amount,
          formData.currency,
          masterCurrency.code,
          conversionDate
        );
      }

      const newIncome: Omit<AssetIncome, 'id'> = {
        assetId: asset.id,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        amount,
        currency: formData.currency,
        masterCurrencyAmount,
        masterCurrency: masterCurrency.code,
        frequency: formData.frequency,
        description: formData.description
      };

      await addDoc(collection(db, 'assetIncomes'), newIncome);

      // Update asset to indicate it has income
      if (!asset.hasIncome) {
        const assetRef = doc(db, 'assets', asset.id);
        await updateDoc(assetRef, { hasIncome: true });
      }

      setShowAddForm(false);
      setFormData({
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        amount: '',
        currency: masterCurrency.code,
        frequency: 'monthly',
        description: ''
      });
      
      // Reload incomes
      const q = query(
        collection(db, 'assetIncomes'),
        where('assetId', '==', asset.id)
      );
      const snapshot = await getDocs(q);
      const incomeList: AssetIncome[] = [];
      snapshot.forEach((doc) => {
        incomeList.push({ id: doc.id, ...doc.data() } as AssetIncome);
      });
      setIncomes(incomeList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Income for {asset.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Income History</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Income
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 text-sm p-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      required
                      step="0.01"
                      min="0"
                      value={formData.amount}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frequency
                    </label>
                    <select
                      name="frequency"
                      required
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {Object.entries(INCOME_FREQUENCIES).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Income'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount ({masterCurrency.code})</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {incomes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No income records found. Click "Add Income" to add one.
                    </td>
                  </tr>
                ) : (
                  incomes.map((income) => (
                    <tr key={income.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(income.startDate)}
                        {income.endDate ? ` - ${formatDate(income.endDate)}` : ' (Ongoing)'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(income.amount, income.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(income.masterCurrencyAmount, income.masterCurrency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {INCOME_FREQUENCIES[income.frequency]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {income.description || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetIncomeDialog;