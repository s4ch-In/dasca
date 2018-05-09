const express = require('express');
const app = express();
const cors = require('cors')
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const http = require('http');
const url = require('url');
const config = require('./app/config/config').get(process.env.NODE_ENV);
const morgan = require('morgan');
const server = http.createServer(app);
// const io = require('socket.io')(server);
// const wss = new WebSocket.Server({
//   server: server,
//   autoAcceptConnections: true
// });
require('./app/db/db');
app.use(cors());

// app.use(cookieParser());
app.use(express.static(__dirname + '/dist')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

require('./routes')(app); // configure our routes

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ s: false, m: err.message, d: err })
})

server.listen(config.port, () => {
    console.log('Running in  ' + process.env.NODE_ENV);
    console.log('Magic happens on port ' + config.port);
});


module.exports.abc = (app);