import Stripe from 'stripe';
import { db } from '../../firebaseConfig'; // Adjust path as needed
import { doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      const orderId = session.metadata.orderId;
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'paid' });
      res.status(200).json({ status: 'paid', orderId });
    } else {
      res.status(400).json({ status: 'not_paid' });
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ error: error.message });
  }
}