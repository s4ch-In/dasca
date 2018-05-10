const mongoose = require('mongoose');
const Config = require('../config/config').get(process.env.NODE_ENV);
const connection = mongoose.createConnection(Config.database);
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const groudSchema = new Schema({
  regNo: {
    type: Number
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
  totalAmount: {
    type: Number,
    required: [true, "Please enter total amount"]
  },
  amountPaid: {
    type: Number,
    required: [true, "Please enter amount paid"]
  },
  company: {
    name: {
      type: String,
      uppercase: true,
      // required: true
    },
    address: {
      type: String,
      uppercase: true,
      // required: true
    },
    contactNo: {
      type: Number
    }
  },
  poc: {
    name: {
      type: String,
      uppercase: true,
      // required: true
    },
    contactNo: {
      type: Number
    }
  },
  person: {
    name: {
      type: String,
      uppercase: true,
      // required: true
    },
    address: {
      type: String,
      uppercase: true,
      // required: true
    },
    contactNo: {
      type: Number
    }
  },
  bookingDates: {
    from: {
      type: Date
    },
    to: {
      type: Date
    }
  },
  category: {
    type: String,
    uppercase: true,
    required: true,
    enum: ['P', 'C']
  }

}, {
  timestamps: true
});

autoIncrement.initialize(connection);
groudSchema.plugin(autoIncrement.plugin, {
  model: 'Geound',
  field: 'regNo',
  startAt: 1,
  incrementBy: 1
});




module.exports = mongoose.model('Ground', groudSchema);
