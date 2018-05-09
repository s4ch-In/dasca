const moment = require('moment');
const Form = require('../models/forms');
const limitPerPage = 10;
module.exports.create = (req, res, next) => {
  const messages = [];
  console.log(req.body.dob)
  req.body.dob = moment(req.body.dob).format('L')
  console.log(req.body.dob)
  if (req.body) {
    let f = new Form(req.body)
    f.save((err, user) => {
      if (err) {
        for (let i in err.errors) {
          messages.push(err.errors[i].message)
        }
        return next(messages)
      } else {
        return res.json({ s: true, m: "Form Submited Successfully", d: user });
      }
    })
  } else {
    return res.json({ s: false, m: "Insufficient Data", d: [] })
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

  Form
    .aggregate(clauseCount).exec((err, studentCount) => {
      if (err) {
        return next(err)
      } else if (studentCount.length > 0) {
        Form
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
