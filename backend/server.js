const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const { connectDB } = require('./config/database');

const app = express();

// Connexion MongoDB
connectDB();

// Créer les dossiers uploads s'ils n'existent pas
['uploads', 'uploads/products', 'uploads/stores'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MallConnect API is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/passwordReset'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/credit-notes', require('./routes/creditNotes'));
app.use('/api/cash-registers', require('./routes/cashRegisters'));
app.use('/api/events', require('./routes/events'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/admin/reports', require('./routes/adminReports'));
app.use('/api/uploads', require('./routes/uploads'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;