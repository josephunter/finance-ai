import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Asset } from '@/types/asset';

const ASSETS_COLLECTION = 'assets';

export async function getAssets(userId: string): Promise<Asset[]> {
  try {
    const assetsRef = collection(db, ASSETS_COLLECTION);
    const q = query(assetsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Asset));
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
}

export async function createAsset(userId: string, assetData: Omit<Asset, 'id'>): Promise<string> {
  try {
    const assetsRef = collection(db, ASSETS_COLLECTION);
    const docRef = await addDoc(assetsRef, {
      ...assetData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
}

export async function updateAsset(assetId: string, updates: Partial<Asset>): Promise<void> {
  try {
    const assetRef = doc(db, ASSETS_COLLECTION, assetId);
    await updateDoc(assetRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
}

export async function deleteAsset(assetId: string): Promise<void> {
  try {
    const assetRef = doc(db, ASSETS_COLLECTION, assetId);
    await deleteDoc(assetRef);
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
}