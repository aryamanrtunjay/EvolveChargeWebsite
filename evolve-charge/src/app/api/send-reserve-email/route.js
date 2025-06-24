import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email, reservationNumber, firstName, fullName } = await request.json();

    // Validate required fields
    if (!email || !reservationNumber || !firstName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const displayName = fullName ? fullName : firstName;

    const mailOptions = {
      from: `"EVolve Charge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Reservation Confirmation - ${reservationNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reservation Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="font-size: 24px; color: #333333;">Thank You for Your Reservation, ${displayName}!</h1>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">
              Your reservation for the EVolve Charger has been successfully confirmed. You're now one of the early adopters securing priority access to the world’s first automatic EV charger.
            </p>
            <ul style="list-style: none; padding: 0; font-size: 16px; color: #333333;">
              <li><strong>Reservation Number:</strong> ${reservationNumber}</li>
              <li><strong>Deposit Paid:</strong> $4.99</li>
            </ul>
            <p style="font-size: 16px; color: #333333; line-height: 1.5; margin-top: 20px;">
              Next steps:
            </p>
            <ul style="list-style: disc; padding-left: 20px; font-size: 16px; color: #333333;">
              <li>Check your inbox for further confirmation details.</li>
              <li>We’ll notify you when your charger is ready, and you can pay the remaining balance.</li>
              <li>Enjoy priority access for early delivery and exclusive updates.</li>
            </ul>
            <p style="font-size: 16px; color: #333333; line-height: 1.5; margin-top: 20px;">
              If you have any questions or would like to refund and cancel your reservation to be a part of the Next Generation of EV Charging, contact us at 
              <a href="mailto:support@evolve-charge.com" style="color: #0066cc; text-decoration: none;">support@evolve-charge.com</a> or call (425) 324-4529.
            </p>
            <p style="font-size: 16px; color: #333333; margin-top: 20px;">Best regards,<br>The EVolve Charge Team</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Reservation email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending reservation email:", error);
    return NextResponse.json({ error: "Failed to send reservation email" }, { status: 500 });
  }
}