const moment = require('moment');
const User = require('../models/user');
const Receipt = require('../plugin/receipt');
const limitPerPage = 10;

module.exports.create = (req, res, next) => {
  console.log(req.body)
  let memQuarters = []
  const messages = [];
  req.body.dob = moment.utc(req.body.dob, 'DD-MM-YYYY').toDate()
  if (req.body.mode &&
    req.body.balance.toString() &&
    req.body.amountPaid.toString() &&
    req.body.totalAmount.toString() && req.body.membership) {
    Object.keys(req.body.membership).forEach(function(key) {
      if (req.body.membership[key].status) {
        memQuarters.push({ sport: req.body.sport, quarter: key, FY: req.body.membership[key].FY, registeredOn: new Date() })
      }
    });
    if (memQuarters.length > 0) {
      req.body.membership = memQuarters
      if (req.body) {
        req.body.totalAmount = parseFloat(req.body.totalAmount)
        let f = new User(req.body)
        f.save((err, user) => {
          if (err) {
            console.log(err)
            for (let i in err.errors) {
              messages.push(err.errors[i].message)
            }
            return next(messages)
          } else {
            Receipt.generate({
              mode: req.body.mode,
              narration: req.body.narration,
              balance: req.body.balance,
              totalAmount: parseFloat(req.body.totalAmount),
              document: req.body.document,
              amountPaid: req.body.amountPaid,
              sport: req.body.sport,
              category: 'S',
              user: user._id,
              name: user.firstName + ' ' + user.lastName,
              discountPercent: req.body.discountPercent,
              discountAmount: req.body.discountAmount,
              finalAmount: req.body.finalAmount
            }, (err, r) => {
              if (err) {
                return next(err)
              } else {
                user.receipts.push(r._id)
                user.save((err, u) => {
                  if (err) {
                    return next(err)
                  } else {
                    return res.json({ s: true, m: "User registered Successfully", d: { u, r } });
                  }
                })
              }
            })
          }
        })
      } else {

        return next(new Error("Invalid Data"))
      }
    } else {
      let newEr = new Error()
      newEr = ['Please provide quarter of registration']
      return next(newEr)
    }
  } else {
    return next(new Error('Invalid receipt data'))
  }
};

module.exports.get = (req, res, next) => {
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
}

module.exports.pay = (req, res, next) => {
  if (req.body.userId) {
    User
      .findOne({ userId: req.body.userId })
      .exec((err, user) => {
        if (err) {
          return next(err)
        } else {
          Object.keys(req.body.membership).forEach(function(key) {
            if (req.body.membership[key].status) {
              user.membership.push({ sport: req.body.sport, quarter: key, FY: req.body.membership[key].FY })
            }
          });
          Receipt.generate({
            mode: req.body.mode,
            narration: req.body.narration,
            balance: req.body.balance,
            totalAmount: parseFloat(req.body.totalAmount),
            amountPaid: req.body.amountPaid,
            sport: req.body.sport,
            category: 'S',
            user: user._id,
            name: user.firstName + ' ' + user.lastName,
            document: req.body.document,
            discountPercent: req.body.discountPercent,
            discountAmount: req.body.discountAmount,
            finalAmount: req.body.finalAmount
          }, (err, r) => {
            if (err) {
              return next(err)
            } else {
              user.balance = user.balance + r.balance;
              user.receipts.push(r._id);
              user.save((err, u) => {
                if (err) {
                  return next(err)
                } else {
                  return res.json({ s: true, m: "User registered Successfully", d: { u, r } });
                }
              })
            }
          })
        }
      });
  } else {
    return next(new Error('Insufficient data'))
  }
}

module.exports.update = (req, res, next) => {
  if (req.body.userId) {
    User
      .findOne({ userId: req.body.userId })
      .populate('receipts')
      .exec((err, user) => {
        if (err) {
          return next(err)
        } else {
          user = req.body
          user.save((err, u) => {
            if (err) {
              return next(err)
            } else {
              return res.json({ s: true, m: 'user updated successfully', d: u })
            }
          })
        }
      })
  } else {
    return next(new Error('Insufficient Data'))
  }
};
