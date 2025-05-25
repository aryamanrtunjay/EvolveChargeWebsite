import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card', 'google_pay', 'apple_pay', 'klarna'],
      metadata: {
        donorId: metadata.donorId,
        email: metadata.email,
        donationType: metadata.donationType,
        donationId: metadata.donationId || '',
        firstName: metadata.firstName || '',
        lastName: metadata.lastName || '',
        dedicateTo: metadata.dedicateTo || null,
        anonymous: metadata.anonymous || false,
      },
    });
    console.log('API: Payment intent created, ID:', paymentIntent.id);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        metadata: {
          donationId: metadata.donationId,
          firstName: metadata.firstName,
          lastName: metadata.lastName,
          dedicateTo: metadata.dedicateTo,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('API Error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}