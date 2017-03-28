'use strict';
// Include our "db"
var db = require('../../config/db.js')();
// Exports all the functions to perform on the db
module.exports = {getAll, save, getOne, update, delMovie};

//GET /movie operationId
function getAll(req, res, next) {
    //res.json({ movies: db.find()});
    var callback = (movies) => { res.json({ movies: movies }) };
    db.find(callback);
}

//POST /movie operationId
function save(req, res, next) {
    var callback = (success) => {
        if(success === 1) {
            res.json({success: success, description: "Movie added to the list!"});
        }else{
            res.status(400).send();
            //res.json({message: "Movie not added to the list!"});
        }
    };
    db.save(callback, req.body);
}

//GET /movie/{id} operationId
function getOne(req, res, next) {
    var id = req.swagger.params.id.value; //req.swagger contains the path parameters
    var callback = (movie) => {
        if(movie) {
            res.json(movie);
        }else {
            res.status(400).send();
        }
    };
    db.find(callback, id);
}

//PUT /movie/{id} operationId
function update(req, res, next) {
    var id = req.swagger.params.id.value; //req.swagger contains the path parameters
    var movie = req.body;
    var callback = (success) => {
        if (success === 1) {
            res.json({success: success, description: "Movie updated!"});
        } else {
            res.status(400).send();
            //res.json({message: "Movie not updated!"});
        }
    };
    db.update(callback, id, movie);
}

//DELETE /movie/{id} operationId
function delMovie(req, res, next) {
    var id = req.swagger.params.id.value; //req.swagger contains the path parameters
    var callback = (success) => {
        if(success === 1){
            res.json({success: success, description: "Movie deleted!"});
        }else{
            res.status(400).send();
        }
    };
    db.remove(callback, id);
}