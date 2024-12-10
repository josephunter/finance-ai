import React from 'react';
import { DollarSign } from 'lucide-react';
import { useCurrency, CURRENCIES } from '../../contexts/CurrencyContext';

const CurrencySettings: React.FC = () => {
  const { masterCurrency, setMasterCurrency } = useCurrency();

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Currency Settings</h3>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Master Currency
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This is your default currency for tracking assets. All values will be converted to this currency.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => setMasterCurrency(currency)}
                  className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                    masterCurrency?.code === currency.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="mr-3">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {currency.code}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currency.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySettings;