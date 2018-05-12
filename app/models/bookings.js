const mongoose = require('mongoose');
const Config = require('../config/config').get(process.env.NODE_ENV);
const connection = mongoose.createConnection(Config.database);
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const Float = require('mongoose-float').loadType(mongoose, 4);
const bookingSchema = new Schema({
  bookingNo: {
    type: Number
  },
  bookingId: {
    type: String
  },
  category: {
    type: String,
    enum: ['S', 'G']
  },
  narration: {
    type: String,
    uppercase: true,
    maxlength: 40
  },
  totalAmount: {
    type: Float,
    required: [true, "Please enter total amount"]
  },
  discountPercent: {
    type: Float
  },
  discountAmount: {
    type: Float
  },
  finalAmount: {
    type: Float,
  },
  amountPaid: {
    type: Float,
    required: [true, 'Please enter payable amount']
  },
  balance: {
    type: Float
  },
  sport: {
    type: String
  },
  expireOn: {
    type: Date
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
bookingSchema.plugin(autoIncrement.plugin, {
  model: 'Booking',
  field: 'bookingNo',
  startAt: 1,
  incrementBy: 1
});
bookingSchema.pre('save', function(next) {
  if (this.isNew) {
    let d = new Date();
    let y = d.getMonth() < 3 ? d.getYear() - 1 : d.getYear();
    this.bookingId = y.toString() + this.bookingNo.toString();
    return next()
  } else {
    return next()
  }
})


module.exports = mongoose.model('Booking', bookingSchema);
