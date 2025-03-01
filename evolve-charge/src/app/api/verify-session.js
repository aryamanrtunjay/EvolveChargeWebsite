import Stripe from 'stripe';
import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const orderId = session.metadata.orderId;

    if (session.payment_status === 'paid') {
      await updateDoc(doc(db, 'orders', orderId), { status: 'paid' });
      return res.status(200).json({ status: 'paid', orderId });
    } else {
      return res.status(200).json({ status: 'unpaid' });
    }
  } catch (error) {
    console.error('Verify Session Error:', error);
    res.status(500).json({ error: 'Failed to verify session' });
  }
}