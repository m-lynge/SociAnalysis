const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors');

const fs = require('fs');
const https = require('https');

const os = require('os');


const directoryRoute = require('./routes/directory.route');



const privatekey = fs.readFileSync('../social.key', 'utf8')
const certificate = fs.readFileSync('../social.crt', 'utf8')


const pf = 'mta19635';

const credentials = {
    key: privatekey,
    cert: certificate,
    passphrase: pf
};

const app = express();
app.use(bodyParser.json({limit: '100mb', extended: true}));
// app.use(cors());
app.use(bodyParser.urlencoded({limit: '100mb', extended: true, parameterLimit: 900000}) );

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://localhost:4201");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/directory', directoryRoute);


const port = process.env.PORT || 4000;

 let httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log('Listening on port ', port);
    console.log('server:',
    httpsServer.listening);
});

//
// app.listen(port, () => {
// });
