const mongoose = require('mongoose');
const Config = require('../config/config').get(process.env.NODE_ENV);
const connection = mongoose.createConnection(Config.database);
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const mongooseHistory = require('mongoose-history')
const Float = require('mongoose-float').loadType(mongoose, 4);
const userSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  registrationNo: {
    type: Number
  },
  time: {
    type: String
  },
  batch: {
    type: String,
    uppercase: true
  },
  caste: {
    type: String,
    uppercase: true
  },
  firstName: {
    type: String,
    required: [true, 'Please enter first name'],
    uppercase: true
  },
  discountPercent: {
    type: Float
  },
  discountAmount: {
    type: Float
  },
  membership: [{
    registeredOn: {
      type: Date,
    },
    sport: {
      type: String
    },
    quarter: {
      type: String,
      enum: ['q1', 'q2', 'q3', 'q4']
    },
    FY: {
      type: String
    }
  }],
  middleName: {
    type: String,
    uppercase: true
  },
  lastName: {
    type: String,
    required: [true, 'Please enter last name'],
    uppercase: true
  },
  mobileNo: {
    type: String
    // required: [true, "Please enter mobile number"]
  },
  father: {
    ffullName: {
      type: String,
      // required: [true, "Please enter Father's name"],
      uppercase: true
    },
    foccupation: {
      type: String,
      uppercase: true
    },
    fanualIncome: {
      type: Number
    },
    fmobileNo: {
      type: String,
      // required: [true, "Please enter Father's mobile number"]
    },
    fresNo: {
      type: String
    }
  },
  mother: {
    mfullName: {
      type: String,
      // required: [true, "Please enter Mother's name"],
      uppercase: true
    },
    moccupation: {
      type: String,
      uppercase: true
    },
    mmobileNo: {
      type: String
    }
  },
  dob: {
    type: Date,
    required: [true, "Please enter Date Of Birth"]
  },
  currentClass: {
    type: String,
    required: [true, "Please enter Current class"],
    uppercase: true
  },
  school: {
    type: String,
    required: [true, "Please enter School Name"],
    uppercase: true
  },
  address: {
    type: String,
    required: [true, "Please enter Address"],
    uppercase: true
  },
  heightInCms: {
    type: String,
    uppercase: true
  },
  weightInKg: {
    type: String,
    uppercase: true
  },
  coachingCampDetail: {
    type: String,
    uppercase: true
  },
  repSchoolTeam: {
    type: String,
    uppercase: true
  },
  prevParticipation: {
    type: String,
    uppercase: true
  },
  otehrAreaOfInterest: {
    type: String,
    uppercase: true
  },
  coach: {
    type: String,
    uppercase: true
  },
  secretary: {
    type: String,
    uppercase: true
  },
  amountPaid: {
    type: Float,
    required: [true, "Please enter Fees Paid"]
  },
  totalAmount: {
    type: Float,
    required: [true, "Please enter total amount"]
  },
  finalAmount: {
    type: Float,
    required: [true, "Please enter final amount "]
  },
  balance: {
    type: Float,
    // required: [true, "Please enter Fees Paid"]
  },
  addIncharge: {
    type: String,
    required: [true, "Please enter Admission incharge"],
    uppercase: true
  },
  receipts: [{
    type: Schema.Types.ObjectId,
    ref: 'Receipt'
  }]
}, {
  timestamps: true
});

autoIncrement.initialize(connection);
userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'registrationNo',
  startAt: 1,
  incrementBy: 1
});

// userSchema.plugin(autoIncrement.plugin, {
//   model: 'User',
//   field: 'userId',
//   startAt: 1111,
//   incrementBy: 1
// });

userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.userId = new Date().getYear() + 'S' + this.registrationNo.toString();
    return next()
  } else {
    return next()
  }
});

userSchema.plugin(mongooseHistory)

module.exports = mongoose.model('User', userSchema);
