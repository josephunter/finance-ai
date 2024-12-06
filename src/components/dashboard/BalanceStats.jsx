import React from 'react'
import { 
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'
import { useCurrency } from '../../hooks/useCurrency'
import { formatCurrency } from '../../utils/formatters'
import StatCard from './StatCard'

export default function BalanceStats({ totalBalance = 0, totalAssets = 0 }) {
  const { currency } = useCurrency()

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Balance"
        value={formatCurrency(totalBalance, currency)}
        icon={BanknotesIcon}
      />
      
      <StatCard
        title="Total Assets"
        value={totalAssets}
        icon={ChartBarIcon}
      />
      
      <StatCard
        title="Last Update"
        value={new Date().toLocaleDateString()}
        icon={ClockIcon}
      />
    </div>
  )
}
