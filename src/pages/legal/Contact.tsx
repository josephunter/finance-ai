import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Mail, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Contact Us
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Have questions about PortfolioLens? We're here to help. Contact us using any of the methods below.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </h3>
                <a
                  href="mailto:contact@codevine.net"
                  className="text-blue-600 dark:text-blue-500 hover:underline"
                >
                  contact@codevine.net
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Website
                </h3>
                <a
                  href="https://codevine.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500 hover:underline"
                >
                  codevine.net
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Business Hours
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Monday - Friday: 9:00 AM - 6:00 PM (UTC+3)
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We typically respond to inquiries within 24 business hours.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Contact;