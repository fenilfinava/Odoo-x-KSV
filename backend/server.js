const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const vendorRoutes = require('./src/routes/vendorRoutes');
const rfqRoutes = require('./src/routes/rfqRoutes');
const quotationRoutes = require('./src/routes/quotationRoutes');
const approvalRoutes = require('./src/routes/approvalRoutes');
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/rfq', rfqRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'VendorBridge API is running!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
