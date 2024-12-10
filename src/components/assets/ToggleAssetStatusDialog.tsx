import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Asset, AssetStatus } from '../../types/asset';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface ToggleAssetStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

const ToggleAssetStatusDialog: React.FC<ToggleAssetStatusDialogProps> = ({ isOpen, onClose, asset }) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState(asset.inactiveReason || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const newStatus: AssetStatus = asset.status === 'active' ? 'inactive' : 'active';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const assetRef = doc(db, 'assets', asset.id);
      const updateData: Partial<Asset> = {
        status: newStatus,
      };

      if (newStatus === 'inactive') {
        updateData.inactiveDate = new Date().toISOString().split('T')[0];
        updateData.inactiveReason = reason;
      } else {
        // Remove inactive fields when activating
        updateData.inactiveDate = null;
        updateData.inactiveReason = null;
      }

      await updateDoc(assetRef, updateData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update asset status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {newStatus === 'inactive' ? 'Deactivate Asset' : 'Activate Asset'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {newStatus === 'inactive' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason for Deactivation
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Asset sold, Lost access, etc."
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Updating...' : newStatus === 'inactive' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToggleAssetStatusDialog;