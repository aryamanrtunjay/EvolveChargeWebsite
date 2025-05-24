import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY);

export async function POST(req) {
  try {
    console.log('API: Received request to create payment intent');
    const { amount, metadata } = await req.json();
    console.log('API: Request body - amount:', amount, 'metadata:', metadata);

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount provided');
    }

    console.log('API: Creating payment intent with Stripe');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Already in cents from client
      currency: 'usd',
      metadata: metadata,
    });
    console.log('API: Payment intent created, ID:', paymentIntent.id);

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('API Error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}