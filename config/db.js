"use strict;"
//Include crypto to generate the movie id
var crypto = require('crypto');
var mysql = require('mysql');
var connection;

function startconnection(){
// Configure MySQL connection
    connection = mysql.createConnection({
        host: 'fahrenheit.sui-inter.net',
        user: 'swagger',
        password: '30_1hfjM',
        database: 'swagger'
    });

//Establish MySQL connection
    connection.connect(function(err) {
        if (err)
            throw err;
        else {
            console.log('Connected to MySQL');
        }
    });
}
function  stopconnection(){
    connection.end(function(err) {
        if (err)
            throw err;
        else {
            console.log('Disconnection from MySQL');

        }
    });
}


module.exports = function(){
    return {
        movieList : [],
        /*
         * Save the movie inside the "db".
         */
        save(callback, movie) {
            startconnection();
            movie.id = crypto.randomBytes(20).toString('hex');
            connection.query("INSERT INTO movie SET ?", movie, function(err,result,fields) {
                if(err) {
                    stopconnection();
                    callback(0);
                }
                if(result) {
                    stopconnection();
                    callback(1);
                }
            });
        },
        /*
         * Retrieve a movie with a given id or return all the movies if the id is undefined.
         */
        find(callback, id) {
            startconnection();
            if(id) {
                connection.query("SELECT * FROM movie WHERE id = ?", id, function(err,result,fields){
                    if(err){

                    }
                    if(result){
                        stopconnection();
                        callback(result[0]);
                    }
                });
                return this.movieList;
            }else {
                connection.query('SELECT * FROM movie', (err,result,fields) => {
                    if(err){

                    }
                    if(result){
                        result.map(r => {
                            this.movieList.push(r);
                        });
                        stopconnection();
                        callback(this.movieList);
                    }
                });
            }
        },
        /*
         * Delete a movie with the given id.
         */
        remove(callback, id) {
            startconnection();
            connection.query("DELETE FROM movie WHERE id = ?", id, function(err,result,fields){
                if(result.affectedRows === 0){
                    stopconnection();
                    callback(0);
                }else if(result.affectedRows !== 0){
                    stopconnection();
                    callback(1);
                }
            });
        },
        /*
         * Update a movie with the given id
         */
        update(callback, id, movie) {
            startconnection();
            connection.query("UPDATE movie SET title = ?, year = ? WHERE id = ?", [movie.title, movie.year, id], function(err,result,fields){
                if(result.changedRows === 0){
                    stopconnection();
                    callback(0);
                }else if(result.changedRows !== 0){
                    stopconnection();
                    callback(1);
                }
            });
        }
    }

};
