import React from 'react';
import { CURRENCIES, useCurrency } from '../../contexts/CurrencyContext';

const CurrencyModal: React.FC = () => {
  const { showCurrencyModal, setMasterCurrency } = useCurrency();

  if (!showCurrencyModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
            Select Your Master Currency
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            This will be your default currency for tracking assets. You can still add assets in other currencies.
          </p>
          <div className="mt-2 space-y-2">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => setMasterCurrency(currency)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center space-x-2"
              >
                <span className="text-lg">{currency.symbol}</span>
                <span className="font-medium">{currency.code}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">- {currency.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyModal;