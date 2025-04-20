const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.generateDonationReceipt = async (donation) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const fileName = `receipt-${donation._id}.pdf`;
    const filePath = path.join(__dirname, `../public/receipts/${fileName}`);

    // Ensure directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add content to PDF
    doc.fontSize(20).text('Donation Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Receipt #: ${donation._id}`);
    doc.text(`Date: ${donation.createdAt.toDateString()}`);
    doc.moveDown();
    doc.text(`Donor: ${donation.donor.name}`);
    doc.text(`Campaign: ${donation.campaign.title}`);
    doc.moveDown();
    doc.fontSize(18).text(`Amount: $${donation.amount.toFixed(2)}`, {
      align: 'right',
    });
    doc.moveDown(2);
    doc
      .fontSize(12)
      .text(
        'Thank you for your generous donation. This receipt serves as official documentation for your records.',
        { align: 'center' }
      );

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};