import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Asset } from '@/types/asset';
import { addAssetValue } from './asset-value-service';

const ASSETS_COLLECTION = 'assets';
const VALUES_COLLECTION = 'asset_values';
const INCOMES_COLLECTION = 'asset_incomes';

export async function createAsset(userId: string, asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Create the asset
    const docRef = await addDoc(collection(db, ASSETS_COLLECTION), {
      ...asset,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Add initial value
    await addAssetValue({
      assetId: docRef.id,
      date: asset.purchaseDate,
      value: asset.purchaseValue,
      currency: asset.purchaseCurrency,
      masterCurrencyValue: asset.masterCurrencyValue,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
}

export async function getUserAssets(userId: string): Promise<Asset[]> {
  try {
    const q = query(collection(db, ASSETS_COLLECTION), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Asset));
  } catch (error) {
    console.error('Error getting user assets:', error);
    throw error;
  }
}

export async function updateAsset(assetId: string, updates: Partial<Asset>) {
  try {
    const assetRef = doc(db, ASSETS_COLLECTION, assetId);
    await updateDoc(assetRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
}

export async function deleteAsset(assetId: string) {
  try {
    // Delete all asset values
    const valuesQuery = query(collection(db, VALUES_COLLECTION), where('assetId', '==', assetId));
    const valuesSnapshot = await getDocs(valuesQuery);
    await Promise.all(valuesSnapshot.docs.map(doc => deleteDoc(doc.ref)));

    // Delete all asset incomes
    const incomesQuery = query(collection(db, INCOMES_COLLECTION), where('assetId', '==', assetId));
    const incomesSnapshot = await getDocs(incomesQuery);
    await Promise.all(incomesSnapshot.docs.map(doc => deleteDoc(doc.ref)));

    // Finally, delete the asset itself
    await deleteDoc(doc(db, ASSETS_COLLECTION, assetId));
  } catch (error) {
    console.error('Error deleting asset and related data:', error);
    throw error;
  }
}