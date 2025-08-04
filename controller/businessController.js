const Business = require('../model/businessModel');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'onlinebusinessr205@gmail.com',
    pass: 'legg izpn nudv kxww' // app password, no spaces
  }
});

async function sendBusinessEmail(to, subject, text) {
  await transporter.sendMail({
    from: 'onlinebusinessr205@gmail.com',
    to,
    subject,
    text
  });
}

// Register a new business
exports.registerBusiness = async (req, res) => {
  try {
    const { businessName, address, ownerName, email, businessType } = req.body;
    // Basic validation
    if (!businessName || !address || !ownerName || !email || !businessType) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Check for duplicate business name
    const existing = await Business.findOne({ businessName });
    if (existing) {
      return res.status(409).json({ message: 'Business name already exists.' });
    }
    const business = new Business({ businessName, address, ownerName, email, businessType });
    await business.save();
    res.status(201).json({ message: 'Business registered successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all pending businesses
exports.getPendingBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ status: 'pending' });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve a business
exports.approveBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    if (!business) return res.status(404).json({ message: 'Business not found' });

    // 1. Generate PDF certificate
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const pdfPath = path.join(__dirname, `../../uploads/${business._id}_certificate.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Set paper color background for entire certificate
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#FEFDEA');

    // Header - Somali Government Style
    doc.fontSize(16).fillColor('#000').text('JAMHUURIYADDA FEDERAALKA SOOMALIYA', { align: 'center' });
    doc.fontSize(14).fillColor('#000').text('WASAARADDA GANACSIGA IYO WARSHADAHA', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(16).fillColor('#000').text('FEDERAL REPUBLIC OF SOMALIA', { align: 'center' });
    doc.fontSize(14).fillColor('#000').text('MINISTRY OF COMMERCE AND INDUSTRY', { align: 'center' });
    doc.moveDown(0.5);
    
    // Draw horizontal line
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Title - Commercial License Style
    doc.fontSize(24).fillColor('#000').text('SHATIGA GANACSIGA', { align: 'center' });
    doc.fontSize(20).fillColor('#000').text('COMMERCIAL LICENSE', { align: 'center' });
    doc.moveDown(0.5);

    // License Number and Date
    const licenseNumber = business._id.toString().slice(-6).toUpperCase();
    doc.fontSize(16).fillColor('#000').text(`Shati Lam/License No.: ${licenseNumber}`, { align: 'left' });
    doc.fontSize(14).fillColor('#000').text(`Taariikhda/Date: ${new Date().toLocaleDateString('en-GB')}`, { align: 'right' });
    doc.moveDown(1);

    // Table layout
    const tableTop = doc.y + 20;
    const tableLeft = 40;
    const tableWidth = 515;
    const rowHeight = 35;
    const col1Width = 200;
    const col2Width = 315;
    const numRows = 5;

    // Add paper color background to table
    doc.rect(tableLeft, tableTop, tableWidth, rowHeight * numRows).fill('#FEFDEA');

    // Draw outer rectangle
    doc.strokeColor('#000').lineWidth(1.5).roundedRect(tableLeft, tableTop, tableWidth, rowHeight * numRows, 5).stroke();

    // Draw rows
    for (let i = 1; i < numRows; i++) {
      doc.moveTo(tableLeft, tableTop + rowHeight * i)
         .lineTo(tableLeft + tableWidth, tableTop + rowHeight * i)
         .stroke();
    }

    // Draw vertical line
    doc.moveTo(tableLeft + col1Width, tableTop)
       .lineTo(tableLeft + col1Width, tableTop + rowHeight * numRows)
       .stroke();

    // Table content - Somali Government Style
    const fields = [
      ['Magaca Shirkadda / Name of Company:', business.businessName || ''],
      ['Taariikhda La diiwaangeliyay / Registration Date:', business.createdAt ? new Date(business.createdAt).toLocaleDateString('en-GB') : ''],
      ['Nooca Ganacsiga / Type of Business:', business.businessType || ''],
      ['Cinwaanka Shirkadda/ganacsiga / Address:', business.address || ''],
      ['Taariikhda la Bixiyay / Date of Issue:', new Date().toLocaleDateString('en-GB')]
    ];

    fields.forEach((row, i) => {
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#000')
        .text(row[0], tableLeft + 8, tableTop + rowHeight * i + 10, { width: col1Width - 16, align: 'left' });
      doc.font('Helvetica').fontSize(12).fillColor('#000')
        .text(row[1], tableLeft + col1Width + 8, tableTop + rowHeight * i + 10, { width: col2Width - 16, align: 'left' });
    });

    // Legal basis section
    doc.moveDown(1);
    doc.fontSize(10).fillColor('#000').text('Legal Basis / Asaasi Qaanuun:', { align: 'left' });
    doc.fontSize(9).fillColor('#333').text('This Commercial License is issued in accordance with the Business Registration Act of Somalia.', { align: 'left' });
    
    // Warning section
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#000').text('F.G. / N.B.:', { align: 'left' });
    doc.fontSize(9).fillColor('#333').text('Anyone who falsifies this Commercial License commits a punishable crime. This license is valid for 12 months from the date of issue.', { align: 'left' });

    // Signature section
    doc.moveDown(1);
    doc.fontSize(14).fillColor('#000').text('Wasiirka Ganacsiga iyo Warshadaha', { align: 'right' });
    doc.fontSize(12).fillColor('#000').text('(The Minister of Commerce and Industry)', { align: 'right' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000').text('_________________________', { align: 'right' });
    doc.fontSize(10).fillColor('#000').text('Signature / Saxiixa', { align: 'right' });
    // doc.image('path/to/signature.png', tableLeft + tableWidth / 2 - 30, tableTop + rowHeight * numRows + 50, { width: 80 });

    doc.end();

    writeStream.on('finish', async () => {
      // 2. Send approval email with PDF attachment
      await transporter.sendMail({
        from: 'onlinebusinessr205@gmail.com',
        to: business.email,
        subject: 'Shatiga Ganacsiga - Commercial License Approved',
        text: `Akhri ${business.ownerName},\n\nShirkaddaada "${business.businessName}" waa la aqbalay!\n\nShatiga ganacsiga wuxuu ku lifaaqan yahay email-kan.\n\nMahadsanid.\n\n---\n\nDear ${business.ownerName},\n\nYour business "${business.businessName}" has been approved!\n\nThe commercial license is attached to this email.\n\nThank you.`,
        attachments: [
          {
            filename: `Shatiga_Ganacsiga_${business.businessName}.pdf`,
            path: pdfPath
          }
        ]
      });
      // 3. Delete the PDF after sending
      fs.unlink(pdfPath, () => {});
      res.json({ message: 'Business approved and certificate sent', business });
    });
    writeStream.on('error', (err) => {
      res.status(500).json({ message: 'Failed to generate certificate PDF', error: err.message });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject a business
exports.rejectBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    // Send rejection email
    await sendBusinessEmail(
      business.email,
      'Your Business Has Been Rejected',
      `Akhri ${business.ownerName},\n\nShirkaddaada "${business.businessName}" lama Aqbalin!\n\nMahadsanid.\n\n---\n\nDear ${business.ownerName},\n\nWe regret to inform you that your business "${business.businessName}" has been rejected.\n\nThank you.`
    );
    res.json({ message: 'Business rejected', business });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all approved businesses
exports.getApprovedBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ status: 'approved' });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a business
exports.updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const business = await Business.findByIdAndUpdate(id, update, { new: true });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json({ message: 'Business updated', business });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a business
exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findByIdAndDelete(id);
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json({ message: 'Business deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get business counts
exports.getBusinessCounts = async (req, res) => {
  try {
    // Only count approved businesses for total
    const total = await Business.countDocuments({ status: 'approved' });
    const approved = total;
    const pending = await Business.countDocuments({ status: 'pending' });
    res.json({ total, approved, pending });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get approved business counts by type and rejected count
exports.getBusinessTypeCounts = async (req, res) => {
  try {
    // Group by businessType for approved
    const approvedByType = await Business.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: "$businessType", count: { $sum: 1 } } }
    ]);
    // Get rejected count
    const rejected = await Business.countDocuments({ status: 'rejected' });
    res.json({ approvedByType, rejected });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search all businesses by query
exports.searchBusinesses = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") return res.json([]);
    const regex = new RegExp(q, "i");
    const results = await Business.find({
      $or: [
        { businessName: regex },
        { ownerName: regex },
        { address: regex },
        { email: regex },
        { businessType: regex }
      ]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 