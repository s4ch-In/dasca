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
                    r.user = user
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
                    r.ground = user
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

  if (req.query.c == 'S') {
    const clausePagiNation = [
      { $lookup: { from: 'receipts', localField: 'receipts', foreignField: '_id', as: 'r' } },
      {
        $project: {
          user: {
            $arrayElemAt: ['$r', 0]
          },
          e: "$$ROOT"
        }
      },
      {
        $project: {
          name: { $concat: ["$e.firstName", " ", "$e.lastName"] },
          doc: "$$ROOT"
        }
      },
      {
        $match: {
          "doc.user.balance": { $gt: 0 },
          "name": new RegExp(req.query.key, 'i'),
        }
      },
      { $sort: { "doc.user.createdAt": -1 } },
      { $skip: (parseInt(req.query.p) > 0 ? parseInt(req.query.p) : 0) * parseInt(limitPerPage) },
      { $limit: limitPerPage }
    ];

    const clauseCount = [
      { $lookup: { from: 'receipts', localField: 'receipts', foreignField: '_id', as: 'r' } },
      {
        $project: {
          user: {
            $arrayElemAt: ['$r', 0]
          },
          e: "$$ROOT"
        }
      },
      {
        $project: {
          name: { $concat: ["$e.firstName", " ", "$e.lastName"] },
          doc: "$$ROOT"
        }
      },
      {
        $match: {
          "name": new RegExp(req.query.key, 'i'),
        }
      },
      { $group: { _id: null, count: { $sum: 1 } } }
    ];

    User
      .aggregate(clauseCount).exec((err, studentCount) => {
        if (err) {
          return next(err)
        } else if (studentCount.length > 0) {
          User
            .aggregate(clausePagiNation).exec((err, docs) => {
              if (err) {
                return next(err)
              } else if (docs) {
                return res.json({ s: true, m: "Registered", d: { u: docs, t: studentCount[0].count } })
              } else {
                return res.json({ s: true, m: "No Record Found", d: { u: docs, t: 0 } })
              }
            })
        } else {
          return res.json({ s: true, m: "No Record Found", d: { u: [], t: 0 } })
        }
      })

  } else {
    const clausePagiNation = [
      { $lookup: { from: 'receipts', localField: 'receipts', foreignField: '_id', as: 'r' } },
      {
        $project: {
          user: {
            $arrayElemAt: ['$r', 0]
          },
          e: "$$ROOT"
        }
      },
      // {
      //   $project: {
      //     name: { $concat: ["$e.firstName", " ", "$e.lastName"] },
      //     doc: "$$ROOT"
      //   }
      // },
      {
        $match: {
          "e.balance": { $gt: 0 },
          //     "name": new RegExp(req.query.key, 'i'),
        }
      },
      { $sort: { "doc.user.createdAt": -1 } },
      { $skip: (parseInt(req.query.p) > 0 ? parseInt(req.query.p) : 0) * parseInt(limitPerPage) },
      { $limit: limitPerPage }
    ];

    const clauseCount = [
      { $lookup: { from: 'receipts', localField: 'receipts', foreignField: '_id', as: 'r' } },
      {
        $project: {
          user: {
            $arrayElemAt: ['$r', 0]
          },
          e: "$$ROOT"
        }
      },
      // {
      //   $project: {
      //     name: { $concat: ["$e.firstName", " ", "$e.lastName"] },
      //     doc: "$$ROOT"
      //   }
      // },
      {
        $match: {
          "e.balance": { $gt: 0 },
          $or: [
            { "e.poc.name": new RegExp(req.query.key, 'i') },
            { "e.person.name": new RegExp(req.query.key, 'i') },
            { "e.company.name": new RegExp(req.query.key, 'i') }

          ]
        }
      },
      { $group: { _id: null, count: { $sum: 1 } } }
    ];

    Ground
      .aggregate(clauseCount).exec((err, studentCount) => {
        if (err) {
          return next(err)
        } else if (studentCount.length > 0) {
          Ground
            .aggregate(clausePagiNation).exec((err, docs) => {
              if (err) {
                return next(err)
              } else if (docs) {
                return res.json({ s: true, m: "abc", d: { u: docs, t: studentCount[0].count } })
              } else {
                return res.json({ s: true, m: "No Record Found", d: { u: docs, t: 0 } })
              }
            })
        } else {
          return res.json({ s: true, m: "No Record Found", d: { u: [], t: 0 } })
        }
      })
  }
}
