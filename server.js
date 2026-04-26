require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ─────────────────────────────
// Middleware
// ─────────────────────────────
app.use(cors({
  origin: '*', // later restrict to your GitHub Pages domain
}));
app.use(express.json());

// ─────────────────────────────
// MongoDB Connection (no deprecated options)
// ─────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ Mongo Error:', err.message);
    process.exit(1);
  });

// ─────────────────────────────
// Schema & Model
// ─────────────────────────────
const RowSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  platformId: { type: String, required: true },
  date: String,
  category: String,
  title: String,
  content: String,
  refLink: String,
  finalLink: String,
  status: String,
  qc: String,
  comments: String,
}, { timestamps: true });

const Row = mongoose.model('Row', RowSchema);

// ─────────────────────────────
// Health Check
// ─────────────────────────────
app.get('/', (req, res) => {
  res.send('API Running...');
});

// ─────────────────────────────
// Routes
// ─────────────────────────────

// GET rows by client + platform
app.get('/rows', async (req, res) => {
  try {
    const { clientId, platformId } = req.query;

    if (!clientId || !platformId) {
      return res.status(400).json({ error: 'clientId and platformId are required' });
    }

    const rows = await Row.find({ clientId, platformId })
      .sort({ createdAt: -1 });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE row
app.post('/rows', async (req, res) => {
  try {
    const row = new Row(req.body);
    await row.save();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE row
app.put('/rows/:id', async (req, res) => {
  try {
    const updated = await Row.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Row not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE row
app.delete('/rows/:id', async (req, res) => {
  try {
    const deleted = await Row.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Row not found' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────
// Server Start
// ─────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});