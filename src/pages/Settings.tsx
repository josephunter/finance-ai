import { PasswordSettings } from '@/components/settings/PasswordSettings';
import { CurrencySettings } from '@/components/settings/CurrencySettings';

export default function Settings() {
  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <CurrencySettings />
        <PasswordSettings />
      </div>
    </div>
  );
}