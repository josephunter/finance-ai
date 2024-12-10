import React, { useState, useRef } from 'react';
import { User, Lock, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updatePassword, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      const file = e.target.files[0];
      const storage = getStorage();
      const photoRef = ref(storage, `profile-photos/${user.uid}`);
      
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);
      
      await updateProfile(user, { photoURL });
      setSuccess('Profile photo updated successfully');
    } catch (err) {
      setError('Failed to update profile photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Settings</h3>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 p-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-200 p-3 rounded">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full text-white hover:bg-blue-700"
                >
                  <Upload size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload a new profile photo. The photo should be a square image in JPG, PNG, or GIF format.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;