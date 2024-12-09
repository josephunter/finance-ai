import { PasswordSettings } from '@/components/settings/PasswordSettings';
import { CurrencySettings } from '@/components/settings/CurrencySettings';
import { PageHeader } from "@/components/ui/page-header";

export default function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and configurations"
      />
      <div className="grid gap-6">
        <CurrencySettings />
        <PasswordSettings />
      </div>
    </div>
  );
}