const mongoose = require('mongoose');
const Config = require('../config/config').get(process.env.NODE_ENV);
const connection = mongoose.createConnection(Config.database);
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const Float = require('mongoose-float').loadType(mongoose, 4);

const groudSchema = new Schema({
  regNo: {
    type: Number
  },
  regId: {
    type: String,
    uppercase: true,
    unique: true,
    sparse: true,
    trim: true
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
  finalAmount: {
    type: Float,
    required: [true, "Please enter final amount "]
  },
  discountAmount: {
    type: Float
  },
  balance: {
    type: Float
  },
  amountPaid: {
    type: Float,
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
      type: String
    }
  },
  poc: {
    name: {
      type: String,
      uppercase: true,
      // required: true
    },
    contactNo: {
      type: String
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
      type: String
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
  },
  receipts: [{
    type: Schema.Types.ObjectId,
    ref: 'Receipt'
  }]
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

groudSchema.pre('save', function(next) {
  if (this.isNew) {
    this.regId = 'G' + this.regNo.toString();
    return next()
  } else {
    return next()
  }
})




module.exports = mongoose.model('Ground', groudSchema);
