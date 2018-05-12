const moment = require('moment');
const User = require('../models/user');
const Ground = require('../models/ground');
const Receipt = require('../plugin/receipt');
const limitPerPage = 10;

module.exports.create = (req, res, next) => {
  console.log(req.body)
  let messages = [];
  if (req.body) {
    req.body.bookingDates = {};
    req.body.bookingDates.from = req.body.dateFromTo[0]
    req.body.bookingDates.to = req.body.dateFromTo[1]
    req.body.totalAmount = parseFloat(req.body.totalAmount)
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
            totalAmount: parseFloat(req.body.totalAmount),
            amountPaid: req.body.amountPaid,
            document: req.body.document,
            ground: g._id,
            category: 'G',
            name: (g.category == 'P') ? g.person.name : g.company.name,
            discountPercent: req.body.discountPercent,
            discountAmount: req.body.discountAmount,
            finalAmount: req.body.finalAmount
          }, (err, r) => {
            if (err) {
              return next(err)
            } else {
              g.receipts.push(r._id);
              g.save((err, gr) => {
                if (err) {
                  return next(err)
                } else {
                  return res.json({ s: true, m: "Payment successfull", d: { r, gr } })
                }
              })
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
    .count({
      $or: [
        { 'person.name': new RegExp(req.query.key, 'i') },
        { 'regId': new RegExp(req.query.key, 'i') },
        { 'company.name': new RegExp(req.query.key, 'i') },
        { 'poc.name': new RegExp(req.query.key, 'i') },
        { 'person.contactNo': new RegExp(req.query.key, 'i') },
        { 'poc.contactNo': new RegExp(req.query.key, 'i') },
        { 'company.contactNo': new RegExp(req.query.key, 'i') },
      ]
    })
    .exec((err, c) => {
      if (err) {
        return next(err);
      } else {
        Ground
          .find({
            $or: [
              { 'person.name': new RegExp(req.query.key, 'i') },
              { 'regId': new RegExp(req.query.key, 'i') },
              { 'company.name': new RegExp(req.query.key, 'i') },
              { 'poc.name': new RegExp(req.query.key, 'i') },
              { 'person.contactNo': new RegExp(req.query.key, 'i') },
              { 'poc.contactNo': new RegExp(req.query.key, 'i') },
              { 'company.contactNo': new RegExp(req.query.key, 'i') },
            ]
          })
          .populate('receipts')
          .limit(limitPerPage)
          .sort({ createdAt: -1 })
          .skip((parseInt(req.query.p) > 0 ? parseInt(req.query.p) : 0) * parseInt(limitPerPage))
          .exec((err, g) => {
            if (err) {
              return next(err);
            } else {
              return res.json({ s: true, m: 'List of ground', d: g, t: c });
            }
          })
      }
    })
};

module.exports.update = (req, res, next) => {

};
