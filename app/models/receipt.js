const mongoose = require('mongoose');
const Config = require('../config/config').get(process.env.NODE_ENV);
const connection = mongoose.createConnection(Config.database);
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const receiptSchema = new Schema({
  receiptNo: {
    type: Number
  },
  name: {
    type: String,
    uppercase: true
  },
  mode: {
    type: String,
    uppercase: true,
    enum: ['CASH', 'CHEQUE', 'DD', 'CARD', 'ONLINE'],
    required: [true, 'Please specify mode of payment']
  },
  document: {
    no: {
      type: String,
      uppercase: true,
    },
    bank: {
      type: String
    },
    date: {
      type: Date
    }
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
  totalAmount: {
    type: Number,
    required: [true, "Please enter total amount"]
  },
  discountPercent: {
    type: Number
  },
  discountAmount: {
    type: Number
  },
  amountPaid: {
    type: Number,
    required: [true, 'Please enter payable amount']
  },
  balance: {
    type: Number
  },
  sport: {
    type: String
  },
  category: {
    type: String,
    enum: ['S', 'G']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  ground: {
    type: Schema.Types.ObjectId,
    ref: 'Ground'
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
    console.log(this.receiptId)
    console.log(y)
    return next()
  } else {
    return next()
  }
})


module.exports = mongoose.model('Receipt', receiptSchema);
