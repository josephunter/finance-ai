import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AssetIncome } from '@/types/asset';

const INCOME_COLLECTION = 'asset_incomes';

export async function addAssetIncome(income: Omit<AssetIncome, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, INCOME_COLLECTION), {
      ...income,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding asset income:', error);
    throw error;
  }
}

export async function getAssetIncomes(assetId: string): Promise<AssetIncome[]> {
  try {
    const q = query(
      collection(db, INCOME_COLLECTION),
      where('assetId', '==', assetId),
      orderBy('startDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AssetIncome));
  } catch (error) {
    console.error('Error getting asset incomes:', error);
    throw error;
  }
}

export async function updateAssetIncome(incomeId: string, updates: Partial<AssetIncome>) {
  try {
    const incomeRef = doc(db, INCOME_COLLECTION, incomeId);
    await updateDoc(incomeRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating asset income:', error);
    throw error;
  }
}

export async function deleteAssetIncome(incomeId: string) {
  try {
    await deleteDoc(doc(db, INCOME_COLLECTION, incomeId));
  } catch (error) {
    console.error('Error deleting asset income:', error);
    throw error;
  }
}