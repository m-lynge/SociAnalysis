const express = require('express');
const app = express();
const directoryRoute = express.Router();
const fs = require('fs')

// returns all the user's paths found in the directory
directoryRoute.route('/getUsers').get(function (req, res) {
    const path = './users/';
    fs.readdir(path, function (err, items) {
        console.log("printing users from: ", path);
        console.log(items);
        res.json(items);
    });
})

// returns all the project's paths from a user
// found in the directory
directoryRoute.route('/getProjects/:user').get(function (req, res) {
    const path = './users/' + req.params.user + '/';
    fs.readdir(path, function (err, items) {
        console.log("Printing projects from", path);
        console.log(items);
        res.json(items);
    });
})

// returns all the search paths from a given project from a given user
// found in the directory
directoryRoute.route('/getSearches/:user/:project').get(function (req, res) {
    const path = './users/' + req.params.user + '/' + req.params.project + '/';
    fs.readdir(path, function (err, items) {
        console.log("Printing searches from", path);
        console.log(items);
        res.json(items);
    });
})

// checks if directory given already exists, returns true or false
directoryRoute.route('/dirExists/:path').get(function (req, res){
    const finalPath = './users/' + req.params.path;
    if (fs.existsSync(finalPath)){
        res.json(true)
    } else{
        res.json(false)
    }
})
// checks if directory given already exists, returns true or false
directoryRoute.route('/dirExists/:user/:project').get(function (req, res){
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/';
    if (fs.existsSync(finalPath)){
        res.json(true)
    } else{
        res.json(false)
    }
})

// creates a folder in the path passed through the arguments 
directoryRoute.route('/makeDir/:user').get(function (req, res) {
    const path = './users/' + req.params.user;
    // asynchronously creates a directory
    fs.mkdir(path, (err) => {
        if (err) {
            res.json(err)
        } else{
            res.json(true)
        }
    })
})

directoryRoute.route('/makeDir/:user/:project').get(function (req, res) {
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/';
    // asynchronously creates a directory
    fs.mkdir(finalPath, (err) => {
        if (err) {
            res.json(err)
        } else{
            res.json(true)
        }
    })
})

directoryRoute.route('/saveJSON/:user/:project/:object').get(function (req,res) {
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/';
    
    console.log("groups title: ", req.params.object.title);
    fs.writeFile(req.params.object.title + '.json', req.params.object, 'utf8', callback);
    // fs.writeFile('myjsonfile.json', json, 'utf8', callback);
})

module.exports = directoryRoute;