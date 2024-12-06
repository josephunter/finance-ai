import React, { useState } from 'react'
import { CURRENCIES } from '../../types/currency'
import CurrencySelect from './CurrencySelect'

export default function CurrencyDisplay({ currency, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempCurrency, setTempCurrency] = useState(currency)

  const handleUpdate = () => {
    onUpdate(tempCurrency)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <CurrencySelect
          value={tempCurrency}
          onChange={setTempCurrency}
          className="w-40"
        />
        <button
          onClick={handleUpdate}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Save
        </button>
        <button
          onClick={() => {
            setTempCurrency(currency)
            setIsEditing(false)
          }}
          className="text-sm text-gray-500 hover:text-gray-400"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">
        {CURRENCIES[currency]?.symbol} - {CURRENCIES[currency]?.name}
      </span>
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm text-gray-500 hover:text-gray-400"
      >
        Change
      </button>
    </div>
  )
}
