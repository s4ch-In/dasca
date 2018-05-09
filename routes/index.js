const Form = require('../app/controllers/form')

module.exports = (app) => {
    app.post('/register', Form.create)
    app.get('/user', Form.get)
}