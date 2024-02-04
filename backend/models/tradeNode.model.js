const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: String,
  rewards: {
    currency: String,
    amount: Number,
  },
});

const sourceSchema = new mongoose.Schema({
  name: String,
  destinations: [destinationSchema],
});

const packTypeSchema = new mongoose.Schema({
  type: { type: String, enum: ['gold', 'gilda', 'stab'] },
  sources: [sourceSchema],
});

const PackType = mongoose.model('PackType', packTypeSchema);

module.exports = PackType;
