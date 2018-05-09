const moment = require('moment');
const User = require('../models/user');
const Ground = require('../models/ground');
const Receipt = require('../plugin/receipt');
const limitPerPage = 10;

module.exports.create = (req, res, next) => {
  let messages = [];
  if (req.body) {
    let newGround = new Ground(req.body)
    let errors = newGround.validateSync()
    if (errors) {
      for (let i in errors.errors) {
        messages.push(errors.errors[i].message)
      }
      return next(messages)
    } else {
      newGround.save((err, g) => {
        if (err) {
          return next(err)
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
              return res.json({ s: true, m: "Payment successfull", d: { r, g } })
            }
          })
        }
      })
    }
  } else {
    return next(new Error("Invalid Data"))
  }
};

module.exports.get = (req, res, next) => {
  Ground
    .find({ name: new RegExp(req.query.key, 'i') })
    .limit(limitPerPage)
    .skip((parseInt(req.query.p) > 0 ? parseInt(req.query.p) : 0) * parseInt(limitPerPage))
    .exec((err, g) => {
      if (err) {
        return next(err);
      } else {
        return res.json({ s: true, m: 'List of ground', d: g });
      }
    })
};

module.exports.update = (req, res, next) => {

};
