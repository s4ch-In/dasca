const moment = require('moment');
const Sport = require('../models/sports');
const limitPerPage = 10;

module.exports.create = (req, res, next) => {
  let messages = []
  if (req.body) {
    let s = new Sport(req.body)
    let errors = s.validateSync()
    if (errors) {
      for (let i in errors.errors) {
        messages.push(errors.errors[i].message)
      }
      return next(messages)
    } else {

    }
  } else {
    return next(new Error("Invalid Data"))
  }
};
module.exports.get = (req, res, next) => {
  Sport
    .find()
    .exec((err, sports) => {
      if (err) {
        return next(err)
      } else {
        return res.json({ s: true, m: "Sports", d: sports })
      }
    })
};
module.exports.update = (req, res, next) => {

};
