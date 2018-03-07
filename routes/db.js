var mongoClient = require('mongodb').MongoClient;
// var User = require('./userModel');
var users = require('./users');
var db;

// Initialize the database
mongoClient.connect("mongodb://localhost:27017/wordgame", function(err, database) {
    if(err) throw err;
    db = database;
});

module.exports = { collection : (name) => db.collection(name) }
