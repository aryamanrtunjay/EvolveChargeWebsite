import Stripe from 'stripe';
import { db } from '../../firebaseConfig'; // Adjust path as needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { orderId, customerData, plan, billingCycle } = req.body;

    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email: customerData.email,
      name: `${customerData.firstName} ${customerData.lastName}`,
      phone: customerData.phone,
      address: {
        line1: customerData.address1,
        line2: customerData.address2 || '',
        city: customerData.city,
        state: customerData.state,
        postal_code: customerData.zipCode,
        country: 'US', // Adjust as needed
      },
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'EVolve Charge Hardware',
            },
            unit_amount: Math.round(plan.oneTimePrice * 100), // Convert to cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} Service Fee`,
            },
            unit_amount:
              billingCycle === 'monthly'
                ? Math.round(plan.monthlyPrice * 100)
                : Math.round(plan.yearlyPrice * 100),
            recurring: {
              interval: billingCycle === 'monthly' ? 'month' : 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription', // Supports both one-time and recurring items
      success_url: `${req.headers.origin}/order?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/order`,
      metadata: { orderId },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}