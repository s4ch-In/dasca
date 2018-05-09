const moment = require('moment');
const User = require('../models/user');
const Receipt = require('../plugin/receipt');
const limitPerPage = 10;

module.exports.create = (req, res, next) => {
  if (req.body) {
    Receipt.generate({
      mode: req.body.mode,
      narration: req.body.narration,
      balance: req.body.balance,
      amount: req.body.amount
    }, (err, r) => {
      if (err) {
        return next(err)
      } else {
        return res.json({ s: true, m: "User registered Successfully", d: r });
      }
    })
  } else {
    return res.json({ s: false, m: "Insufficient Data", d: [] })
  }
};

module.exports.get = (req, res, next) => {
  Receipt
    .find()
    .limit(limitPerPage)
    .skip((parseInt(req.query.p) > 0 ? parseInt(req.query.p) : 0) * parseInt(limitPerPage))
    .exec((err, r) => {
      if (err) {
        return next(err)
      } else {
        return res.json({ s: true, m: "Receipt transactions", d: r })
      }
    })
};
