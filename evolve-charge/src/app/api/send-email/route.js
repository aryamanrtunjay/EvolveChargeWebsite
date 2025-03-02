import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email, firstName, lastName, orderNumber, planName, total, address } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"EVolve Charge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="font-size: 24px; color: #333333;">Thank You for Your Order, ${firstName} ${lastName}!</h1>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">
              Your purchase has been successfully submitted. Here are your order details:
            </p>
            <ul style="list-style: none; padding: 0; font-size: 16px; color: #333333;">
              <li><strong>Order Number:</strong> ${orderNumber}</li>
              <li><strong>Plan:</strong> ${planName}</li>
              <li><strong>Total Paid:</strong> $${total.toFixed(2)}</li>
              <li><strong>Delivery Address:</strong> ${address}</li>
            </ul>
            <p style="font-size: 16px; color: #333333; line-height: 1.5; margin-top: 20px;">
              We’ll keep you updated on the status of your order. If you have any questions, feel free to contact us at 
              <a href="mailto:support@evolvecharge.com" style="color: #0066cc; text-decoration: none;">support@evolvecharge.com</a>.
            </p>
            <p style="font-size: 16px; color: #333333; margin-top: 20px;">Best regards,<br>The EVolve Charge Team</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}