const mongoose = require('mongoose');
const Config = require('../config/config').get(process.env.NODE_ENV);
const connection = mongoose.createConnection(Config.database);
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const receiptSchema = new Schema({
  receiptNo: {
    type: Number
  },
  mode: {
    type: String,
    uppercase: true,
    enum: ['CASH', 'CHEQUE', 'DD', 'CARD', 'ONLINE'],
    required: [true, 'Please specify mode of payment']
  },
  receiptId: {
    type: String,
    uppercase: true
  },
  narration: {
    type: String,
    uppercase: true,
    maxlength: 40
  },
  balance: {
    status: Boolean,
    amount: Number
  },
  amount: {
    type: Number,
    required: [true, 'Please enter payable amount']
  }

}, {
  timestamps: true
});

autoIncrement.initialize(connection);
receiptSchema.plugin(autoIncrement.plugin, {
  model: 'From',
  field: 'receiptNo',
  startAt: 1,
  incrementBy: 1
});
receiptSchema.pre('save', function(next) {
  if (this.isNew) {
    let d = new Date();
    let y = d.getMonth() < 3 ? d.getYear() - 1 : d.getYear();
    this.receiptId = y.toString() + this.receiptNo.toString();
    return next()
  } else {
    return next()
  }
})


module.exports = mongoose.model('Receipt', receiptSchema);
