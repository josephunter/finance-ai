import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { LogOut, Moon, Sun, Menu, Focus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import CurrencyModal from '../currency/CurrencyModal';
import Footer from './Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { masterCurrency } = useCurrency();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <CurrencyModal />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center min-w-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center ml-4">
                <Focus className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white truncate">
                  PortfolioLens
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {masterCurrency && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium hidden sm:block">
                  {masterCurrency.symbol} {masterCurrency.code}
                </span>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:transform-none mt-16 lg:mt-0`}
        >
          <div className="h-full p-4">
            <Navigation />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 px-4 py-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;