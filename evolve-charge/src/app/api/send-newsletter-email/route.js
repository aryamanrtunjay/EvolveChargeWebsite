import { NextResponse } from 'next/server';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import { Readable } from 'stream';

export async function POST(request) {
  try {
    // Parse form data including the PDF file
    const formData = await request.formData();
    const subject = formData.get('subject');
    const content = formData.get('content');
    const attachment = formData.get('attachment');

    // Validate inputs
    if (!subject || !content) {
      return NextResponse.json(
        { message: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // Setup email transporter (replace with your actual email service)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Fetch all subscribers from the mailing list
    const mailingListSnapshot = await getDocs(collection(db, 'mailing-list'));
    const subscribers = mailingListSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: 'No subscribers found in the mailing list' },
        { status: 404 }
      );
    }

    // Setup email attachments if a PDF file was uploaded
    const attachments = [];
    if (attachment) {
      const buffer = await attachment.arrayBuffer();
      attachments.push({
        filename: attachment.name,
        content: Buffer.from(buffer),
        contentType: 'application/pdf',
      });
    }

    // Format HTML content from plain text (preserving line breaks)
    const htmlContent = content
      .replace(/\n/g, '<br />')
      .replace(/\r/g, '')
      .replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );

    // Email template with basic styling
    const emailTemplate = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .container {
              padding: 20px;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${htmlContent}
            <div class="footer">
              <p>
                This email was sent to you because you subscribed to Ampereon newsletter.
                <br>
                If you no longer wish to receive these emails, please email support@evolve-charge.com
              </p>
              <p>© ${new Date().getFullYear()} Ampereon. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Track success and failures
    let successCount = 0;
    let failureCount = 0;

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        const email = subscriber.email || subscriber['email-address'];
        if (!email) {
          console.warn(`Subscriber ${subscriber.id} has no email address`);
          failureCount++;
          return;
        }

        const personalizedHtml = emailTemplate.replace('{{EMAIL}}', encodeURIComponent(email));
        
        const mailOptions = {
          from: `"Ampereon" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: subject,
          html: personalizedHtml,
          attachments: attachments
        };

        await transporter.sendMail(mailOptions);
        successCount++;
      } catch (error) {
        console.error(`Failed to send email to subscriber ${subscriber.id}:`, error);
        failureCount++;
      }
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    return NextResponse.json({
      message: 'Newsletter sent successfully',
      totalRecipients: subscribers.length,
      successCount,
      failureCount,
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { message: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}