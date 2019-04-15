const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors');

const directoryRoute = require('./routes/directory.route');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/directory', directoryRoute);
const port = process.env.PORT || 4000;

const server = app.listen(port, function () {
    console.log('Listening on port ', port);
});