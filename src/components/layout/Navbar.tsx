import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { CurrencySelect } from '@/components/currency/CurrencySelect';
import { Navigation } from './Navigation';
import { Menu, Wallet, LogOut } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const { settings } = useUserSettings();

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center w-full">
          <div className="flex-shrink-0 flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <Navigation onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            
            <Wallet className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold">Asset Tracker</span>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-4">
            <CurrencySelect />
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}