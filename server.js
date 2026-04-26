require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ─────────────────────────────
// Middleware
// ─────────────────────────────
app.use(cors());
app.use(express.json());

// ─────────────────────────────
// MongoDB Connection
// ─────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ Mongo Error:', err.message);
  process.exit(1);
});

// ─────────────────────────────
// Schema & Model
// ─────────────────────────────
const RowSchema = new mongoose.Schema({
  clientId: String,
  platformId: String,
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
// Routes
// ─────────────────────────────

// Test route
app.get('/', (req, res) => {
  res.send('API Running...');
});

// Save a row
app.post('/save', async (req, res) => {
  try {
    const row = new Row(req.body);
    await row.save();
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get rows by client + platform
app.get('/rows', async (req, res) => {
  try {
    const { clientId, platformId } = req.query;

    const rows = await Row.find({ clientId, platformId })
                          .sort({ createdAt: -1 });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a row (optional but useful)
app.delete('/row/:id', async (req, res) => {
  try {
    await Row.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a row (optional)
app.put('/row/:id', async (req, res) => {
  try {
    const updated = await Row.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
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