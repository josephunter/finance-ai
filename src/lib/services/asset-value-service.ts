import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateAsset } from './asset-service';
import type { AssetValue } from '@/types/asset';

const VALUES_COLLECTION = 'asset_values';

export async function addAssetValue(value: Omit<AssetValue, 'id' | 'createdAt'>) {
  try {
    // Add the new value
    const docRef = await addDoc(collection(db, VALUES_COLLECTION), {
      ...value,
      createdAt: new Date().toISOString(),
    });

    // Update the asset with the current value
    await updateAsset(value.assetId, {
      currentValue: value.value,
      currentValueCurrency: value.currency,
      currentValueMasterCurrency: value.masterCurrencyValue,
      lastValueUpdate: value.date,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding asset value:', error);
    throw error;
  }
}

export async function getAssetValues(assetId: string): Promise<AssetValue[]> {
  try {
    const q = query(
      collection(db, VALUES_COLLECTION),
      where('assetId', '==', assetId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AssetValue));
  } catch (error) {
    console.error('Error getting asset values:', error);
    throw error;
  }
}

export async function deleteAssetValue(valueId: string) {
  try {
    await deleteDoc(doc(db, VALUES_COLLECTION, valueId));
  } catch (error) {
    console.error('Error deleting asset value:', error);
    throw error;
  }
}