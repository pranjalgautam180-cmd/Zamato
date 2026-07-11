const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const db = require('./Confiq/db');
const userRoutes = require('./Routes/userRoutes');
const productRoutes = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const vendorRoutes = require('./Routes/vendorRoutes');
const orderRoutes = require('./Routes/orderRoutes');

const app = express();
const PORT = Number(process.env.PORT || 8001);
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', async (req, res) => {
  try {
    await db.authenticate();
    res.json({ message: 'Database connected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



async function startServer() {
  try {
    await db.authenticate();
    console.log('Database connected successfully');

    await db.sync({ alter: true });
    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
