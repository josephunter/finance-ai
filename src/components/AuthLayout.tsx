import React from 'react';
import { Moon, Sun, Focus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Focus className="h-12 w-12 text-blue-600 dark:text-blue-500" />
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            PortfolioLens
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Intelligent portfolio tracking with multi-currency support
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;