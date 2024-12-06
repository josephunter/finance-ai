import { CURRENCIES } from '../types/currency'

export function formatCurrency(amount, currencyCode) {
  if (!currencyCode || !CURRENCIES[currencyCode]) {
    return amount.toString()
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatNumber(number) {
  return new Intl.NumberFormat('en-US').format(number)
}
