// app/api/send-welcome-email/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure email transport
// For production, replace with your actual SMTP credentials
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Alternative: Using SendGrid
// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    // Parse request body
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Create formatted date for the email
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to EVolve Charge</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
          }
          .email-header {
            background: linear-gradient(to right, #0d9488, #06b6d4);
            padding: 30px;
            text-align: center;
          }
          .email-header img {
            max-width: 180px;
            height: auto;
          }
          .email-body {
            padding: 30px;
          }
          .email-footer {
            background-color: #f5f5f5;
            padding: 20px 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          h1 {
            color: #0d9488;
            margin-top: 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(to right, #0d9488, #06b6d4);
            color: white;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 50px;
            margin: 20px 0;
            font-weight: 600;
          }
          .features {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
          }
          .feature {
            flex: 1;
            text-align: center;
            padding: 15px;
          }
          .feature img {
            width: 50px;
            height: 50px;
            margin-bottom: 10px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
          }
          .social-links img {
            width: 24px;
            height: 24px;
          }
          p {
            margin: 15px 0;
          }
          .greeting {
            font-size: 18px;
            font-weight: 500;
          }
          @media only screen and (max-width: 600px) {
            .features {
              flex-direction: column;
            }
            .feature {
              margin-bottom: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <div class="email-header" style="text-align: center; padding: 20px; background-color: #f5f5f5;">
                <img src="https://evolve-charge.com/images/LogoWhite.png" alt="EVolve Charge Logo" style="max-width: 200px;">
            </div>
            <div class="email-body" style="padding: 20px;">
                <p class="greeting" style="font-size: 18px;">Hello ${firstName || 'there'},</p>
                <h1 style="color: #333;">Welcome to the EVolve Charge Community!</h1>
                <p>We're thrilled to have you join our growing community of EV enthusiasts and eco-conscious drivers.</p>
                
                <p>As a subscriber, you'll enjoy:</p>
                <ul>
                    <li>Early access to new product announcements</li>
                    <li>Exclusive subscriber-only offers and discounts</li>
                    <li>Informative content about EV charging technology</li>
                    <li>Tips for maximizing your electric vehicle experience</li>
                    <li>Updates on our mission to accelerate sustainable transportation</li>
                </ul>
                
                <p>We're committed to sending you only the most relevant and valuable content, typically once or twice a week.</p>
                
                <h2 style="color: #333;">Introducing The EVolve Charger</h2>
                <p>Our flagship product offers a seamless charging experience with cutting-edge features:</p>
                <ul>
                    <li><strong>Automatic Connection:</strong> The charging arm automatically connects and disconnects from your vehicle, eliminating manual plugging.</li>
                    <li><strong>Off-Peak Charging:</strong> Intelligently charges during non-peak hours to save on energy costs and reduce grid load.</li>
                    <li><strong>Battery Health Monitoring:</strong> Tracks and reports your EV's battery health, helping you extend battery lifespan.</li>
                    <li><strong>Universal Compatibility:</strong> Works with all major EV models including Tesla, Ford, Hyundai, Kia, Chevrolet, Nissan, BMW, and more.</li>
                    <li><strong>Smart Home Integration:</strong> Manage charging times, monitor energy usage, and control via the EVolve Charge mobile app.</li>
                </ul>
                
                <div style="text-align: center; margin-top: 20px;">
                    <a href="https://evolve-charge.com/#how-it-works" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View The EVolve Charger</a>
                </div>
                
                <p>If you have any questions or need assistance, our support team is always ready to help at <a href="mailto:support@evolve-charge.com">support@evolve-charge.com</a>.</p>
                
                <p>Charged up and ready to go,</p>
                <p><strong>The EVolve Charge Team</strong></p>
                
                <div class="social-links" style="text-align: center;">
                    <a href="https://x.com/evolvecharge"><img src="https://evolve-charge.com/images/x-logo.png" alt="X" style="width: 30px; margin: 5px;"></a>
                    <a href="https://facebook.com/evolvecharge"><img src="https://evolve-charge.com/images/fb-logo.png" alt="Facebook" style="width: 30px; margin: 5px;"></a>
                    <a href="https://instagram.com/evolve.charge"><img src="https://evolve-charge.com/images/instagram_logo.png" alt="Instagram" style="width: 30px; margin: 5px;"></a>
                    <a href="https://linkedin.com/company/evolvecharge"><img src="https://evolve-charge.com/images/linkedin-logo.png" alt="LinkedIn" style="width: 30px; margin: 5px;"></a>
                </div>
            </div>
            <div class="email-footer" style="text-align: center; padding: 10px; background-color: #f5f5f5; font-size: 12px;">
                <p>© ${new Date().getFullYear()} EVolve Charge Inc. All rights reserved.</p>
                <p>Sammamish, WA</p>
                <p>
                    <a href="https://evolve-charge.com/#privacypolicy">Privacy Policy</a> | 
                    <a href="https://evolve-charge.com/#tos">Terms of Service</a> | 
                </p>
                <p>This email was sent to you because you signed up for the EVolve Charge mailing list on ${currentDate}.</p>
            </div>
        </div>
    </body>

      </html>
    `;

    // Plain text alternative for email clients that don't support HTML
    const textContent = `
      Hello ${firstName || 'there'},
      
      Welcome to the EVolve Charge Community!
      
      Thank you for subscribing to our mailing list. We're excited to have you join our growing community of EV enthusiasts and eco-conscious drivers.
      
      As a subscriber, you'll receive:
      - Early access to new product announcements
      - Exclusive subscriber-only offers and discounts
      - Informative content about EV charging technology
      - Tips for maximizing your electric vehicle experience
      - Updates on our mission to accelerate sustainable transportation
      
      We're committed to sending you only the most relevant and valuable content, typically once or twice a month.
      
      If you have any questions or need assistance, our support team is always ready to help at support@evolvecharge.com.
      
      Charged up and ready to go,
      The EVolve Charge Team
      
      © ${new Date().getFullYear()} EVolve Charge. All rights reserved.
      Sammamish, WA
      
      To unsubscribe, contact: support@evolve-charge.com
      
      This email was sent to you because you signed up for the EVolve Charge mailing list on ${currentDate}.
    `;

    // Email options
    const mailOptions = {
      from: `"EVolve Charge" <notifications@evolvecharge.com>`,
      to: email,
      subject: `Welcome to EVolve Charge, ${firstName || 'EV Enthusiast'}!`,
      text: textContent,
      html: htmlContent,
    };

    // Send email using Nodemailer
    await transporter.sendMail(mailOptions);

    /* 
    // Alternative: Using SendGrid
    const msg = {
      to: email,
      from: 'notifications@evolvecharge.com',
      subject: `Welcome to EVolve Charge, ${firstName || 'EV Enthusiast'}!`,
      text: textContent,
      html: htmlContent,
    };
    await sgMail.send(msg);
    */

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Welcome email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    
    return NextResponse.json(
      { error: 'Failed to send welcome email', details: error.message },
      { status: 500 }
    );
  }
}