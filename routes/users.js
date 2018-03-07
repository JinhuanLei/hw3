var express = require('express');
var router = express.Router();
var db = require('./db');
var User = require('../public/module/userModel.js');
var mongo = require('mongodb');


function save( user, cb ) {
    db.collection('users').save(user, function( err1, writeResult ) {
        db.collection('users').findOne( user, function( err2, savedUser ) {
            cb( err1 || err2, savedUser );
        } );
    } );
}
module.exports.save = save;




module.exports = router;
