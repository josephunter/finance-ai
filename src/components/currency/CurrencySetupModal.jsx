import React, { useState } from 'react'
import CurrencySelect from './CurrencySelect'

export default function CurrencySetupModal({ onSelect }) {
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedCurrency) {
      setError('Please select a currency')
      return
    }
    onSelect(selectedCurrency)
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-sm sm:w-full sm:p-6">
        <div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Select Your Main Currency
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Please select your preferred currency for tracking your finances. This can be changed later in settings.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
          <CurrencySelect
            value={selectedCurrency}
            onChange={(value) => {
              setSelectedCurrency(value)
              setError('')
            }}
            className="mb-4"
          />
          
          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            Confirm Currency
          </button>
        </form>
      </div>
    </div>
  )
}
