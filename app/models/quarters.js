const mongoose = require('mongoose');
const Config = require('../config/config').get(process.env.NODE_ENV);
const connection = mongoose.createConnection(Config.database);
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const quarterSchema = new Schema({
  name: {
    type: String
  },
  months: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quarter', quarterSchema);
