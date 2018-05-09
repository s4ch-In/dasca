const Receipt = require('../models/receipt');

module.exports.generate = (data, cb) => {
  if (data) {
    let receipt = new Receipt({
      mode: data.mode,
      narration: data.narration,
      balance: data.balance,
      amount: data.amount
    })
    let errors = receipt.validaateSync()
    if (errors) {
      for (let i in errors.errors) {
        messages.push(errors.errors[i].message)
      }
      return cb(messages)
    } else {
      receipt.save((err, r) => {
        if (err) {
          cb(err)
        } else {
          cb(null, r)
        }
      })
    }
  } else {
    return cb({ type: 'Error', message: "Can't ready any property of null" })
  }
}
