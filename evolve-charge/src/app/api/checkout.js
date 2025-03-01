import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest Stripe API version
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { orderId, customerData, plan, billingCycle } = req.body;

  try {
    // Define Stripe Checkout line items
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${plan.name} Hardware`,
          },
          unit_amount: Math.round(plan.oneTimePrice * 100), // Convert to cents
        },
        quantity: 1,
      },
      {
        price: billingCycle === 'monthly' ? plan.stripeMonthlyPriceId : plan.stripeYearlyPriceId,
        quantity: 1,
      },
    ];

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription', // Use 'payment' if not a subscription
      success_url: `${req.headers.origin}/order?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/order`,
      metadata: { orderId },
    });

    // Return JSON response with session ID
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}