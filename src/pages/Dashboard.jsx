import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCurrency } from '../hooks/useCurrency'
import BalanceStats from '../components/dashboard/BalanceStats'

export default function Dashboard() {
  const { user } = useAuth()
  const { currency } = useCurrency()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.email}
        </p>
        {currency && (
          <p className="text-sm text-gray-500">
            All amounts are shown in {currency}
          </p>
        )}
      </div>
      
      <BalanceStats 
        totalBalance={0}
        totalAssets={0}
      />

      <div className="mt-6">
        {/* We'll add transaction list and other components here later */}
      </div>
    </div>
  )
}
