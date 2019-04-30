const express = require('express');
const app = express();
const directoryRoute = express.Router();
const fs = require('fs');
const fs_extra = require('fs-extra');
const rimraf = require('rimraf');

directoryRoute.post('/test', (req, res) => {
    res.jsonp("fun");
})

// returns all the user's paths found in the directory
directoryRoute.get('/getUsers', (req, res) => {
    const path = './users/';
    fs.readdir(path, function (err, items) {
        res.jsonp(items);
    });
})

// returns all the project's paths from a user
// found in the directory
directoryRoute.route('/getProjects/:user').get(function (req, res) {
    const path = './users/' + req.params.user + '/';
    fs.readdir(path, function (err, items) {
        if (items.length>0) {
            console.log('length of items: ', items.length);
            console.log('items: ', items);
            finalProejct = items.map((projectName) => {
                newPath = path + projectName + '/' + 'projectinfo.json';
                projectInfo = fs.readFileSync(newPath, 'utf8', (err, data) => {
                    if (err) throw err;
                })
                return {
                    "name": JSON.parse(projectInfo).name,
                    "desc": JSON.parse(projectInfo).desc,
                    "group": JSON.parse(projectInfo).group
                }
            })
            res.jsonp(finalProejct);
        } else {
            res.jsonp([{}]);
        }
    });
})

// returns all the Query paths from a given project from a given user
// found in the directory
directoryRoute.route('/getQueries/:user/:project').get(function (req, res) {
    const path = './users/' + req.params.user + '/' + req.params.project + '/' + 'query' + '/';
    fs.readdir(path, function (err, items) {
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
    let project = result.body.projectName;
    let queryName = result.body.query;

    //   The JSON file being written is a query.json file
    const finalPath = './users/' + username + '/' + project + '/' + 'query' + '/' + queryName;

    returnQuery = fs.readFileSync(finalPath, 'utf8', (err, data) => {
        if (err) throw err;
    })
    res.jsonp(returnQuery);
});

directoryRoute.post('/saveProjectJSON', (req, res) => {

    const result = req;
    let username = result.body.user;
    let project = result.body.project;
    let projectInfo = result.body.projectInfoObject;

    //   The JSON file being written is a query.json file
    const finalPath = './users/' + username + '/' + project + '/';

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

    returnProject = fs.readFileSync(finalPath, 'utf8', (err, data) => {
        if (err) throw err;
    })
    res.jsonp(returnProject);
});

directoryRoute.post('/copyFile', (req, res) => {
    const user = req.body.user;
    const oldProject = req.body.oldProjectName;
    const newProject = req.body.newProjectName;
    const queryName = req.body.queryName;
    const oldPath = './users/' + user + '/' + oldProject + '/query/' + queryName;
    const newPath = './users/' + user + '/' + newProject + '/query/' + queryName;
    fs_extra.copyFileSync(oldPath, newPath);
    res.jsonp(true)
})

directoryRoute.post('/removeProject', (req, res) => {
    const user = req.body.user;
    const project = req.body.projectName;
    const projectPath = './users/' + user + '/' + project +'/';
    rimraf(projectPath, function () {

        console.log('removed the previous project')
    });
    res.jsonp(true)
})

module.exports = directoryRoute;