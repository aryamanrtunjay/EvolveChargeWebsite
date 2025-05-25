import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function POST(request) {
  try {
    const { firstName, lastName, amount, donationId, donationDate, dedicateTo } = await request.json();

    if (!firstName || !lastName || !amount || !donationId || !donationDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set fonts and colors
    const primaryColor = [13, 148, 136]; // Teal color
    const secondaryColor = [6, 182, 212]; // Cyan color
    const textColor = [51, 51, 51];
    const grayColor = [128, 128, 128];

    // Add header with gradient effect (simulated)
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add logo area (you can add actual logo if you have it as base64)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('EVolve Charge', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Tax-Deductible Donation Receipt', 105, 30, { align: 'center' });

    // Reset text color
    doc.setTextColor(...textColor);

    // Add receipt title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Donation Receipt', 105, 60, { align: 'center' });

    // Add horizontal line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 70, 190, 70);

    // Receipt details section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let yPosition = 85;

    // Donor information
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

    // Donation details
    doc.setFont('helvetica', 'bold');
    doc.text('Donation Details:', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Amount: $${amount}`, 20, yPosition);
    yPosition += 10;

    // Dedication section (if applicable)
    if (dedicateTo) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.text(`In Honor/Memory of: ${dedicateTo}`, 20, yPosition);
      yPosition += 15;
    } else {
      yPosition += 5;
    }

    // Add box for important tax information
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
    doc.text('EIN: 33-3680311', 20, yPosition); // Replace with actual EIN
    yPosition += 5;
    doc.text('Sammamish, WA', 20, yPosition);
    yPosition += 5;
    doc.text('support@evolve-charge.com', 20, yPosition);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text(`Receipt generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 280, { align: 'center' });

    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=EvolveCharge_Receipt_${donationId}.pdf`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}