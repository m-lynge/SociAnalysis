const express = require('express');
const app = express();
const directoryRoute = express.Router();
const fs = require('fs')

// returns all the user's paths found in the directory
directoryRoute.route('/getUsers').get(function (req, res) {
    const path = './users/';
    fs.readdir(path, function (err, items) {
        res.json(items);
    });
})

// returns all the project's paths from a user
// found in the directory
directoryRoute.route('/getProjects/:user').get(function (req, res) {
    const path = './users/' + req.params.user + '/';
    fs.readdir(path, function (err, items) {
        console.log("ITEMS: \n: ")
        console.log("ITEMS: \n: ", items)
        if (items) {
            finalProejct = items.map((projectName) => {
                newPath = path + projectName + '/' + 'projectinfo.json';
                projectInfo = fs.readFileSync(newPath, 'utf8', (err, data) => {
                    if (err) throw err;
                })
                return {
                    "name": projectName,
                    "desc": JSON.parse(projectInfo).desc,
                    "group": JSON.parse(projectInfo).group
                }
            })
            console.log("OUTPUT: \n", JSON.stringify(finalProejct))
            res.json(finalProejct);
        }
        else {
            res.json([{}]);
        }
    });
})

// returns all the Query paths from a given project from a given user
// found in the directory
directoryRoute.route('/getQueries/:user/:project').get(function (req, res) {
    const path = './users/' + req.params.user + '/' + req.params.project + '/' + 'query' + '/';
    fs.readdir(path, function (err, items) {
        console.log("Printing searches from", path);
        console.log(items);
        res.json(items);
    });
})

// returns the json file for a given project from a given user 
directoryRoute.route('/getProject/:user/:project').get(function (req, res) {
    const path = './users/' + req.params.user + '/' + req.params.project
        + '/' + 'projectinfo.json';
    returnProject = fs.readFileSync(path, 'utf8', (err, data) => {
        if (err) throw err;
    })
    console.log("Project info json: ", returnProject)
    res.json(returnProject)
})

// returns the json file for a given query from a given project 
// from a given user 
directoryRoute.route('/getQuery/:user/:project/:query').get(function (req, res) {
    const path = './users/' + req.params.user + '/' + req.params.project
        + '/' + 'query' + '/' + req.params.query;
    returnQuery = fs.readFileSync(path, 'utf8', (err, data) => {
        if (err) throw err;
    })
    console.log("Query json: ", returnQuery)
    res.json(returnQuery)
})

// checks if directory given already exists, returns true or false
directoryRoute.route('/dirExists/:path').get(function (req, res) {
    const finalPath = './users/' + req.params.path;
    if (fs.existsSync(finalPath)) {
        res.json(true)
    } else {
        res.json(false)
    }
})
// checks if directory given already exists, returns true or false
directoryRoute.route('/dirExists/:user/:project').get(function (req, res) {
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/';
    if (fs.existsSync(finalPath)) {
        res.json(true)
    } else {
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
        } else {
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
        } else {
            res.json(true)
        }
    })
})

directoryRoute.route('/makeDir/:user/:project/:groupOrQuery').get(function (req, res) {
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/' + req.params.groupOrQuery + '/';
    // asynchronously creates a directory
    fs.mkdir(finalPath, (err) => {
        if (err) {
            res.json(err)
        } else {
            res.json(true)
        }
    })
})


// Route for saving JSON files (object:string)
directoryRoute.route('/saveJSON/:user/:project/:object').get(function (req, res) {
    // The JSON file being written is the group.json
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/';
    fs.writeFile(finalPath + 'projectinfo' + '.json', String(req.params.object), (err) => {
        if (err) {
            res.json(err)
        } else {
            res.json(true)
        }
    });
})



directoryRoute.route('/saveJSON/:user/:project/:query/:object').get(function (req, res) {

    // The JSON file being written is a query.json file
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/' + req.params.query + '/';
    // set queryname to correct later
    fs.writeFile(finalPath + "queryname" + '.json', req.params.object, (err) => {
        if (err) {
            res.json(err)
        } else {
            res.json(true)
        }
    });
})

module.exports = directoryRoute;