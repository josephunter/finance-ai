import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
];

interface CurrencyContextType {
  masterCurrency: Currency | null;
  setMasterCurrency: (currency: Currency) => Promise<void>;
  showCurrencyModal: boolean;
  setShowCurrencyModal: (show: boolean) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masterCurrency, setMasterCurrencyState] = useState<Currency | null>(null);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadMasterCurrency = async () => {
      if (!user) return;

      const userPrefsRef = doc(db, 'userPreferences', user.uid);
      const userPrefs = await getDoc(userPrefsRef);

      if (userPrefs.exists() && userPrefs.data().masterCurrency) {
        setMasterCurrencyState(userPrefs.data().masterCurrency);
      } else {
        setShowCurrencyModal(true);
      }
    };

    loadMasterCurrency();
  }, [user]);

  const setMasterCurrency = async (currency: Currency) => {
    if (!user) return;

    const userPrefsRef = doc(db, 'userPreferences', user.uid);
    await setDoc(userPrefsRef, { masterCurrency: currency }, { merge: true });
    setMasterCurrencyState(currency);
    setShowCurrencyModal(false);
  };

  return (
    <CurrencyContext.Provider value={{ masterCurrency, setMasterCurrency, showCurrencyModal, setShowCurrencyModal }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};