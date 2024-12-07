import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import type { Currency } from '@/types/currency';

interface UserSettings {
  masterCurrency: Currency | null;
}

interface UserSettingsContextType {
  settings: UserSettings;
  loading: boolean;
  updateMasterCurrency: (currency: Currency) => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextType | null>(null);

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({ masterCurrency: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserSettings() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'userSettings', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSettings(docSnap.data() as UserSettings);
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserSettings();
  }, [user]);

  const updateMasterCurrency = async (currency: Currency) => {
    if (!user) return;

    try {
      const newSettings = { ...settings, masterCurrency: currency };
      await setDoc(doc(db, 'userSettings', user.uid), newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating master currency:', error);
      throw error;
    }
  };

  return (
    <UserSettingsContext.Provider
      value={{
        settings,
        loading,
        updateMasterCurrency,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
}