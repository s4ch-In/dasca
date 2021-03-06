const Form = require('../app/controllers/user')
const Ground = require('../app/controllers/ground')
const Receipt = require('../app/controllers/receipts')


module.exports = (app) => {
  // user
  app.post('/user', Form.create)
  app.post('/register', Form.pay)
  app.get('/user', Form.get)
  app.post('/user/update', Form.update)

  // ground
  app.post('/ground', Ground.create)
  app.get('/ground', Ground.get)

  // receipts
  app.post('/receipt', Receipt.create)
  app.get('/receipt', Receipt.get)

  app.get('/debitors', Receipt.debitors)
}
