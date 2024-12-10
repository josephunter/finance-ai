import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LineChart, DollarSign, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Smart Asset Management</span>
                <span className="block text-blue-600 dark:text-blue-500">
                  Made Simple
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Track, analyze, and optimize your investment portfolio with powerful tools.
                Multi-currency support, inflation tracking, and comprehensive analytics at your fingertips.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/about"
                    className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-8 p-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <LineChart className="h-12 w-12 text-blue-600 dark:text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Advanced Analytics
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track performance and trends
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <DollarSign className="h-12 w-12 text-blue-600 dark:text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Multi-Currency
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Global portfolio support
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <TrendingUp className="h-12 w-12 text-blue-600 dark:text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inflation Tracking
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Real value insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;