import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useCurrency } from '../hooks/useCurrency'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import CurrencySetupModal from './currency/CurrencySetupModal'

export default function Layout() {
  const { currency, updateCurrency, loading } = useCurrency()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {!currency && (
        <CurrencySetupModal onSelect={updateCurrency} />
      )}
    </div>
  )
}
