const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Content', contentSchema);