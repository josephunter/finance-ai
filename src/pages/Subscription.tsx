import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SUBSCRIPTION_PLANS } from '../types/subscription';
import { useSubscription } from '../contexts/SubscriptionContext';
import { createCheckoutSession, stripePromise } from '../config/stripe';

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { currentPlan, loading } = useSubscription();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planId: string) => {
    try {
      setProcessingPlanId(planId);
      const { sessionId } = await createCheckoutSession(priceId);
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-center">
            Subscription Plans
          </h1>
          <p className="mt-5 text-xl text-gray-500 dark:text-gray-400 sm:text-center">
            Choose the perfect plan for your portfolio management needs
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700 ${
                currentPlan.id === plan.id
                  ? 'border-2 border-blue-500 dark:border-blue-400'
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h2>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </p>

                <button
                  onClick={() => plan.priceId && handleSubscribe(plan.priceId, plan.id)}
                  disabled={currentPlan.id === plan.id || processingPlanId === plan.id}
                  className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                    currentPlan.id === plan.id
                      ? 'bg-green-100 text-green-800 cursor-default'
                      : processingPlanId === plan.id
                      ? 'bg-gray-100 text-gray-800 cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {currentPlan.id === plan.id
                    ? 'Current Plan'
                    : processingPlanId === plan.id
                    ? 'Processing...'
                    : plan.price === 0
                    ? 'Free Plan'
                    : 'Subscribe'}
                </button>
              </div>

              <div className="px-6 pt-6 pb-8">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;