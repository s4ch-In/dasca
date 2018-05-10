const Receipt = require('../models/receipt');

module.exports.generate = (data, cb) => {
  let messages = []
  if (data) {
    let receipt = new Receipt(data)
    let errors = receipt.validateSync()
    if (errors) {
      for (let i in errors.errors) {
        messages.push(errors.errors[i].message)
      }
      cb(messages)
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
    cb({ type: 'Error', message: "Can't ready any property of null" })
  }
}
