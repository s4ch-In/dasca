const moment = require('moment');
const User = require('../models/user');
const limitPerPage = 10;

module.exports.create = (req, res, next) => {
  const messages = [];
  req.body.dob = moment(req.body.dob).format('L')
  if (req.body) {
    let f = new User(req.body)
    f.save((err, user) => {
      if (err) {
        for (let i in err.errors) {
          messages.push(err.errors[i].message)
        }
        return next(messages)
      } else {
        Receipt.generate({
          mode: req.body.mode,
          narration: req.body.narration,
          balance: req.body.balance,
          amount: req.body.amount
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
};

module.exports.get = (req, res, next) => {
  const clausePagiNation = [{
      $project: {
        name: { $concat: ["$firstName", " ", "$lastName"] },
        doc: "$$ROOT"
      }
    },
    {
      $match: {
        name: new RegExp(req.query.key, 'i'),
      }
    },
    { $sort: { "doc.createdAt": -1 } },
    { $skip: (parseInt(req.query.p) > 0 ? parseInt(req.query.p) : 0) * parseInt(limitPerPage) },
    { $limit: limitPerPage }
  ];

  const clauseCount = [{
      $project: {
        name: { $concat: ["$firstName", " ", "$lastName"] },
        doc: "$$ROOT"
      }
    },
    {
      $match: {
        name: new RegExp(req.query.key, 'i'),
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

module.exports.update = (req, res, next) => {

};
