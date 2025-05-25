import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';

// Configure email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate PDF
function generatePDF({ firstName, lastName, amount, donationId, donationDate, dedicateTo }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set fonts and colors
  const primaryColor = [13, 148, 136];
  const secondaryColor = [6, 182, 212];
  const textColor = [51, 51, 51];
  const grayColor = [128, 128, 128];

  // Add header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('EVolve Charge', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Tax-Deductible Donation Receipt', 105, 30, { align: 'center' });

  doc.setTextColor(...textColor);

  // Add receipt title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Donation Receipt', 105, 60, { align: 'center' });

  // Add horizontal line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 70, 190, 70);

  // Receipt details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  let yPosition = 85;

  doc.setFont('helvetica', 'bold');
  doc.text('Donor Information:', 20, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${firstName} ${lastName}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Donation ID: ${donationId}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Date: ${donationDate}`, 20, yPosition);
  yPosition += 15;

  doc.setFont('helvetica', 'bold');
  doc.text('Donation Details:', 20, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`Amount: $${amount}`, 20, yPosition);
  yPosition += 10;

  if (dedicateTo) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text(`In Honor/Memory of: ${dedicateTo}`, 20, yPosition);
    yPosition += 15;
  } else {
    yPosition += 5;
  }

  // Tax information box
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(20, yPosition, 170, 35, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Tax-Deductible Information', 25, yPosition + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const taxText = 'This donation is tax-deductible to the extent allowed by law. No goods or services were provided in exchange for this donation. Please retain this receipt for your tax records.';
  const splitTaxText = doc.splitTextToSize(taxText, 160);
  doc.text(splitTaxText, 25, yPosition + 16);
  
  yPosition += 45;

  // Thank you message
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const thankYouText = `Thank you for your generous donation to EVolve Charge. Your contribution of $${amount} supports our mission to advance wireless EV charging technology and promote sustainable transportation globally.`;
  const splitThankYou = doc.splitTextToSize(thankYouText, 170);
  doc.text(splitThankYou, 20, yPosition);
  
  yPosition += splitThankYou.length * 7 + 10;

  // Organization information
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text('EVolve Charge Inc.', 20, yPosition);
  yPosition += 5;
  doc.text('A 501(c)(3) Nonprofit Organization', 20, yPosition);
  yPosition += 5;
  doc.text('EIN: XX-XXXXXXX', 20, yPosition);
  yPosition += 5;
  doc.text('Sammamish, WA', 20, yPosition);
  yPosition += 5;
  doc.text('support@evolve-charge.com', 20, yPosition);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text(`Receipt generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 280, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}

export async function POST(request) {
  try {
    const { email, donationId, amount, firstName, lastName, donationType, dedicateTo, anonymous, donationDate } = await request.json();

    if (!email || !donationId || !amount || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields (email, donationId, amount, firstName, lastName)' },
        { status: 400 }
      );
    }

    // Generate PDF directly in this function
    const pdfBuffer = generatePDF({
      firstName,
      lastName,
      amount,
      donationId,
      donationDate: donationDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dedicateTo: dedicateTo || null,
    });

    // Email HTML content
    const dedicateSection = dedicateTo ? `<p><strong>In Honor/Memory Of:</strong> ${dedicateTo}</p>` : '';
    const anonymousNote = anonymous ? '<p><em>This donation was made anonymously.</em></p>' : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Donation to EVolve Charge</title>
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
          .email-header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }
          .email-header p {
            color: white;
            margin: 10px 0 0;
            font-size: 14px;
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
          h2 {
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
          .impact-list {
            background-color: #f0fdfa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .impact-list ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .impact-list li {
            margin: 8px 0;
            color: #0d9488;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            text-decoration: none;
            color: #0d9488;
          }
          p {
            margin: 15px 0;
          }
          .greeting {
            font-size: 18px;
            font-weight: 500;
          }
          .donation-info {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .donation-info p {
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>EVolve Charge</h1>
            <p>Advancing Wireless EV Charging Technology</p>
          </div>
          <div class="email-body">
            <p class="greeting">Dear ${firstName} ${lastName},</p>
            <h2>Thank You for Your Generous Donation!</h2>
            <p>We're incredibly grateful for your support of EVolve Charge. Your contribution makes a real difference in our mission to revolutionize electric vehicle charging.</p>
            
            <div class="donation-info">
              <p><strong>Donation Amount:</strong> $${amount}</p>
              <p><strong>Donation ID:</strong> ${donationId}</p>
              <p><strong>Date:</strong> ${donationDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              ${dedicateSection}
              ${anonymousNote}
            </div>
            
            <p>Your tax-deductible receipt is attached to this email for your records.</p>
            
            <div class="impact-list">
              <p><strong>Your support helps us:</strong></p>
              <ul>
                <li>Develop innovative wireless EV charging solutions</li>
                <li>Make electric vehicle ownership more accessible</li>
                <li>Reduce carbon emissions through sustainable technology</li>
                <li>Build partnerships for global EV infrastructure</li>
              </ul>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@evolve-charge.com">support@evolve-charge.com</a>.</p>
            
            <p>With gratitude,</p>
            <p><strong>The EVolve Charge Team</strong></p>
            
            <div class="social-links">
              <a href="https://x.com/evolvecharge">X (Twitter)</a> |
              <a href="https://facebook.com/evolvecharge">Facebook</a> |
              <a href="https://instagram.com/evolve.charge">Instagram</a> |
              <a href="https://linkedin.com/company/evolvecharge">LinkedIn</a>
            </div>
          </div>
          <div class="email-footer">
            <p>© ${new Date().getFullYear()} EVolve Charge Inc. All rights reserved.</p>
            <p>Sammamish, WA | A 501(c)(3) Nonprofit Organization</p>
            <p>
              <a href="https://evolve-charge.com/#privacypolicy">Privacy Policy</a> | 
              <a href="https://evolve-charge.com/#tos">Terms of Service</a>
            </p>
            <p>This email was sent to you because you made a donation to EVolve Charge.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text alternative
    const textContent = `
Dear ${firstName} ${lastName},

Thank You for Your Generous Donation!

We're incredibly grateful for your support of EVolve Charge. Your contribution makes a real difference in our mission to revolutionize electric vehicle charging.

Donation Details:
- Amount: $${amount}
- Donation ID: ${donationId}
- Date: ${donationDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
${dedicateTo ? `- In Honor/Memory Of: ${dedicateTo}` : ''}
${anonymous ? '- This donation was made anonymously.' : ''}

Your tax-deductible receipt is attached to this email for your records.

Your support helps us:
- Develop innovative wireless EV charging solutions
- Make electric vehicle ownership more accessible
- Reduce carbon emissions through sustainable technology
- Build partnerships for global EV infrastructure

If you have any questions or need assistance, please contact our support team at support@evolve-charge.com.

With gratitude,
The EVolve Charge Team

© ${new Date().getFullYear()} EVolve Charge Inc. All rights reserved.
A 501(c)(3) Nonprofit Organization
Sammamish, WA

Follow us on social media:
X (Twitter): https://x.com/evolvecharge
Facebook: https://facebook.com/evolvecharge
Instagram: https://instagram.com/evolve.charge
LinkedIn: https://linkedin.com/company/evolvecharge

This email was sent to you because you made a donation to EVolve Charge.
    `;

    // Email options with PDF attachment
    const mailOptions = {
      from: `"EVolve Charge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank You for Your Donation to EVolve Charge`,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: `EvolveCharge_Receipt_${donationId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email using Nodemailer
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Donation confirmation email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending donation email:', error);
    return NextResponse.json(
      { error: 'Failed to send donation email', details: error.message },
      { status: 500 }
    );
  }
}