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

// console.log("key: ", privatekey);
// console.log("certficate: ", certificate);

const pf = 'mta19635';

const credentials = {
    key: privatekey,
    cert: certificate,
    passphrase: pf
};

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/directory', directoryRoute);

const port = process.env.PORT || 4000;

let httpsServer = https.createServer(credentials, app);


httpsServer.listen(port, () => {
    console.log('Listening on port ', port);
    console.log('server:',
    httpsServer.listening);
});


// const server = app.listen(port, function () {
//     console.log('Listening on port ', port);
// });