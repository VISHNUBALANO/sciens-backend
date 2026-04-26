const express = require('express');
const router = express.Router();

// ✅ Correct path (VERY IMPORTANT)
const Content = require('./models/Content');


// ─────────────────────────────
// GET DATA (by client + platform)
// ─────────────────────────────
router.get('/data/:client/:platform', async (req, res) => {
  try {
    const { client, platform } = req.params;

    const data = await Content.find({
      clientId: client,
      platformId: platform
    }).sort({ createdAt: -1 }); // latest first

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


// ─────────────────────────────
// SAVE NEW ROW
// ─────────────────────────────
router.post('/data', async (req, res) => {
  try {
    const newData = new Content(req.body);
    await newData.save();

    res.json({ message: 'Saved successfully', data: newData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});


// ─────────────────────────────
// UPDATE ROW
// ─────────────────────────────
router.put('/data/:id', async (req, res) => {
  try {
    const updated = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: 'Updated successfully', data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
});


// ─────────────────────────────
// DELETE ROW
// ─────────────────────────────
router.delete('/data/:id', async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});


module.exports = router;