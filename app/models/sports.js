const mongoose = require('mongoose');
const Config = require('../config/config').get(process.env.NODE_ENV);
const Schema = mongoose.Schema;

const sportsSchema = new Schema({
  name: {
    type: String,
    uppercase: true,
    required: [true, 'Please enter name of sport']
  },
  quaterlyFees: {
    type: Number,
    required: [true, 'Please enter quaterly fees of sport']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Receipt', sportsSchema);
