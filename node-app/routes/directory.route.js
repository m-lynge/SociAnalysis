const express = require('express');
const app = express();
const directoryRoute = express.Router();
const fs = require('fs')

directoryRoute.post('/test', (req, res) => {
    console.log(req.body.fbData);
    res.jsonp("fun");
})

// returns all the user's paths found in the directory
directoryRoute.get('/getUsers', (req, res) => {
    // console.log("FUNCTION FROM SERVER CALLED");
    const path = './users/';
    fs.readdir(path, function (err, items) {
        // console.log("RESPONSE:", req.query.callback + JSON.stringify(items));
        res.jsonp(items);
    });
})

// returns all the project's paths from a user
// found in the directory
directoryRoute.route('/getProjects/:user').get(function (req, res) {
    const path = './users/' + req.params.user + '/';
    fs.readdir(path, function (err, items) {
        // console.log("ITEMS: \n: ")
        // console.log("ITEMS: \n: ", items)
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
            // console.log("OUTPUT: \n", JSON.stringify(finalProejct))
            res.jsonp(finalProejct);
        } else {
            res.jsonp([{}]);
        }
    });
})

// returns all the Query paths from a given project from a given user
// found in the directory
directoryRoute.route('/getQueries/:user/:project').get(function (req, res) {
    // console.clear();
    console.log('THIS METHOD IS CALLED BITCH')
    const path = './users/' + req.params.user + '/' + req.params.project + '/' + 'query' + '/';
    fs.readdir(path, function (err, items) {
        console.log("Printing searches from", path);
        console.log(items);
        res.jsonp(items);
    });
})

// returns the json file for a given project from a given user 
directoryRoute.route('/getProject/:user/:project').get(function (req, res) {
    const path = './users/' + req.params.user + '/' + req.params.project +
        '/' + 'projectinfo.json';
    returnProject = fs.readFileSync(path, 'utf8', (err, data) => {
        if (err) throw err;
    })
    console.log("Project info json: ", returnProject)
    res.jsonp(returnProject)
})

// returns the json file for a given query from a given project 
// from a given user 
directoryRoute.route('/getQuery/:user/:project/:query').get(function (req, res) {
    const path = './users/' + req.params.user + '/' + req.params.project +
        '/' + 'query' + '/' + req.params.query;
    returnQuery = fs.readFileSync(path, 'utf8', (err, data) => {
        if (err) throw err;
    })
    console.log("Query json: ", returnQuery)
    res.jsonp(returnQuery)
})

// checks if directory given already exists, returns true or false
directoryRoute.route('/dirExists/:path').get(function (req, res) {
    const finalPath = './users/' + req.params.path;
    if (fs.existsSync(finalPath)) {
        res.jsonp(true)
    } else {
        res.jsonp(false)
    }
})
// checks if directory given already exists, returns true or false
directoryRoute.route('/dirExists/:user/:project').get(function (req, res) {
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/';
    if (fs.existsSync(finalPath)) {
        res.jsonp(true)
    } else {
        res.jsonp(false)
    }
})

// creates a folder in the path passed through the arguments 
directoryRoute.route('/makeDir/:user').get(function (req, res) {
    const path = './users/' + req.params.user;
    // asynchronously creates a directory
    fs.mkdir(path, (err) => {
        if (err) {
            res.jsonp(err)
        } else {
            res.jsonp(true)
        }
    })
})

directoryRoute.route('/makeDir/:user/:project').get(function (req, res) {
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/';
    // asynchronously creates a directory
    fs.mkdir(finalPath, (err) => {
        if (err) {
            res.jsonp(err)
        } else {
            res.jsonp(true)
        }
    })
})

directoryRoute.route('/makeDir/:user/:project/:groupOrQuery').get(function (req, res) {
    const finalPath = './users/' + req.params.user + '/' + req.params.project + '/' + req.params.groupOrQuery + '/';
    // asynchronously creates a directory
    fs.mkdir(finalPath, (err) => {
        if (err) {
            res.jsonp(err)
        } else {
            res.jsonp(true)
        }
    })
})

// // Route for saving JSON files (object:string)
// directoryRoute.route('/saveJSON/:user/:project/:object').get(function (req, res) {
//     // The JSON file being written is the group.json
//     console.log()
//     const finalPath = './users/' + req.params.user + '/' + req.params.project + '/';
//     fs.writeFile(finalPath + 'projectinfo' + '.json', String(req.params.object), (err) => {
//         if (err) {
//             res.jsonp(err)
//         } else {
//             res.jsonp(true)
//         }
//     });
// })

directoryRoute.post('/saveQueryJSON', (req, res) => {

    const result = req;
    let username = result.body.user;
    let project = result.body.project;
    let query = result.body.query;

    //   The JSON file being written is a query.json file
    const finalPath = './users/' + username + '/' + project + '/' + 'query' + '/';

    console.log("Final Path: " + finalPath);
    fs.writeFile(finalPath + query.name + '.json', JSON.stringify(query), (err) => {
        if (err) {
            res.jsonp(err)
        } else {
            res.jsonp(true)
        }
    });
});

directoryRoute.post('/getQueryJson', (req, res) => {

    const result = req;
    let username = result.body.user;
    let project = result.body.project;
    let queryName = result.body.queryName;
   

    //   The JSON file being written is a query.json file
    const finalPath = './users/' + username + '/' + project + '/' + 'query' + '/' + queryName + '.json';

    console.log("Final Path: " + finalPath);
    returnQuery = fs.readFileSync(finalPath, 'utf8', (err, data) => {
        if (err) throw err;
    })
  //  console.log("Query json: ", returnQuery)
    res.jsonp(returnQuery);
});

directoryRoute.post('/saveProjectJSON', (req, res) => {

    const result = req;
    let username = result.body.user;
    let project = result.body.project;
    let projectInfo = result.body.projectInfoObject;

    //   The JSON file being written is a query.json file
    const finalPath = './users/' + username + '/' + project + '/';

    console.log("Final Path: " + finalPath);
    fs.writeFile(finalPath + 'projectinfo.json', JSON.stringify(projectInfo), (err) => {
        if (err) {
            res.jsonp(err)
        } else {
            res.jsonp(true)
        }
    });
});

directoryRoute.post('/getProjectJson', (req, res) => {

    const result = req;
    let username = result.body.user;
    let projectName = result.body.projectName;
   

    //   The JSON file being written is a query.json file
    const finalPath = './users/' + username + '/' + projectName + '/' + 'projectinfo.json';

    console.log("Final Path: " + finalPath);
    returnProject = fs.readFileSync(finalPath, 'utf8', (err, data) => {
        if (err) throw err;
    })
  //  console.log("Query json: ", returnQuery)
    res.jsonp(returnProject);
});

module.exports = directoryRoute;
