const moment = require('moment');
const User = require('../models/user');
const Ground = require('../models/ground');
const Receipt = require('../plugin/receipt');
const Receipts = require('../models/receipt');
const limitPerPage = 10;

module.exports.create = (req, res, next) => {
  console.log(req.body)
  if (req.body) {
    if (req.body.category == 'S') {
      User
        .findOne({ userId: req.body.userId })
        .exec((err, u) => {
          if (err) {
            return next(err)
          } else if (u) {
            Receipt.generate({
              mode: req.body.mode,
              narration: req.body.narration,
              balance: req.body.balance,
              name: u.firstName + ' ' + u.lastName,
              category: req.body.category,
              user: u._id,
              totalAmount: req.body.totalAmount,
              amountPaid: req.body.amountPaid,
              document: req.body.document,
              discountPercent: req.body.discountPercent,
              discountAmount: req.body.discountAmount,
              finalAmount: req.body.finalAmount
            }, (err, r) => {
              if (err) {
                return next(err)
              } else {
                u.balance = u.balance - r.amountPaid;
                u.receipts.push(r._id)
                u.save((err, user) => {
                  if (err) {
                    return next(err)
                  } else {
                    return res.json({ s: true, m: "User registered Successfully", d: r });
                  }
                })
              }
            })
          } else {
            return next(new Error('Invalid user'))
          }
        })
    } else if (req.body.category == 'G') {
      Ground
        .findOne({ regId: req.body.regId })
        .exec((err, g) => {
          if (err) {
            return next(err)
          } else if (g) {
            Receipt.generate({
              mode: req.body.mode,
              narration: req.body.narration,
              balance: req.body.balance,
              amountPaid: req.body.amountPaid,
              totalAmount: req.body.totalAmount,
              ground: g._id,
              category: 'G',
              name: (g.category == 'P') ? g.person.name : g.company.name,
              document: req.body.document,
              discountPercent: req.body.discountPercent,
              discountAmount: req.body.discountAmount,
              finalAmount: req.body.finalAmount
            }, (err, r) => {
              if (err) {
                return next(err)
              } else {
                g.balance = g.balance - r.amountPaid;
                g.receipts.push(r._id)
                g.save((err, user) => {
                  if (err) {
                    return next(err)
                  } else {
                    return res.json({ s: true, m: "User registered Successfully", d: r });
                  }
                })
              }
            })
          } else {
            return next(new Error('Invalid user'))
          }
        })
    } else {
      return res.json({ s: false, m: "Please specify category", d: [] })
    }
  } else {
    return res.json({ s: false, m: "Insufficient Data", d: [] })
  }
};

module.exports.get = (req, res, next) => {
  Receipts
    .count()
    .exec((err, c) => {
      if (err) {
        return next(err)
      } else {
        Receipts
          .find({ receiptId: new RegExp(req.query.key, 'i') })
          .populate('user')
          .populate('ground')
          .sort({ createdAt: -1 })
          .limit(limitPerPage)
          .skip((parseInt(req.query.p) > 0 ? parseInt(req.query.p) : 0) * parseInt(limitPerPage))
          .exec((err, r) => {
            if (err) {
              return next(err)
            } else {
              return res.json({ s: true, m: "Receipt transactions", d: r, t: c })
            }
          })
      }
    })
};

module.exports.debitors = (req, res, next) => {
  User
    .find({ balance: { $gt: 0 } })
    // .populate()
    .exec((err, u) => {
      if (err) {
        return next(err)
      } else {
        return res.json({ s: true, m: "Debitors list ", d: u })
      }
    })
}
