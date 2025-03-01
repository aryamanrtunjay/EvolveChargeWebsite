// pages/api/send-confirmation-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, orderNumber, planName, total, firstName, lastName, address } = req.body;

  // Validate required fields
  if (!email || !orderNumber || !planName || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create a transporter (configure with your email service credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app-specific password
    },
  });

  // Define email content
  const mailOptions = {
    from: `"EVolve Charge" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <h1>Thank You for Your Order, ${firstName} ${lastName}!</h1>
      <p>Your purchase has been successfully submitted. Here are your order details:</p>
      <ul>
        <li><strong>Order Number:</strong> ${orderNumber}</li>
        <li><strong>Plan:</strong> ${planName}</li>
        <li><strong>Total Paid:</strong> $${total.toFixed(2)}</li>
        <li><strong>Delivery Address:</strong> ${address}</li>
      </ul>
      <p>We’ll keep you updated on the status of your order. If you have any questions, feel free to contact us at support@evolvecharge.com.</p>
      <p>Best regards,<br/>The EVolve Charge Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}