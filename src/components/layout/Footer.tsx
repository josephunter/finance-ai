import React from 'react';
import { Link } from 'react-router-dom';
import { Focus } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center">
              <Focus className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                PortfolioLens
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Intelligent portfolio tracking with multi-currency support
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400">
                <a href="mailto:contact@codevine.net" className="hover:text-blue-600 dark:hover:text-blue-500">
                  contact@codevine.net
                </a>
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400">
                <a href="https://codevine.net" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-500">
                  codevine.net
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} PortfolioLens by Codevine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;