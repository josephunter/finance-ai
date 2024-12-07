import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe('pk_test_51OqXXXXXXXXXXXXXXXXXXXXX');

export async function createCheckoutSession(priceId: string, userId: string) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
      }),
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}