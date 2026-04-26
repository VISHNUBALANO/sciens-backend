require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());

// ── ROUTES IMPORT ──
const routes = require('./routes');
app.use('/api', routes);

// ── MONGODB CONNECTION ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });

// ── TEST ROUTE ──
app.get('/', (req, res) => {
  res.send('API Running...');
});

// ── START SERVER ──
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});