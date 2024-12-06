import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './useAuth'

export function useCurrency() {
  const [currency, setCurrency] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function loadCurrency() {
      if (!user) {
        setLoading(false)
        return
      }

      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists() && userDoc.data().currency) {
        setCurrency(userDoc.data().currency)
      }
      
      setLoading(false)
    }

    loadCurrency()
  }, [user])

  const updateCurrency = async (newCurrency) => {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, { currency: newCurrency }, { merge: true })
    setCurrency(newCurrency)
  }

  return {
    currency,
    updateCurrency,
    loading
  }
}
