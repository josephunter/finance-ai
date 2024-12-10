import { loadStripe } from '@stripe/stripe-js';
import { getApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Initialize Stripe
export const stripePromise = loadStripe('pk_test_your_publishable_key');

// Firebase Functions
const functions = getFunctions(getApp());

// Create checkout session
export const createCheckoutSession = async (priceId: string) => {
  try {
    const createStripeCheckout = httpsCallable(functions, 'createStripeCheckout');
    const { data } = await createStripeCheckout({ priceId });
    return data as { sessionId: string };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create customer portal session
export const createPortalSession = async () => {
  try {
    const createPortal = httpsCallable(functions, 'createPortalSession');
    const { data } = await createPortal();
    return data as { url: string };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};