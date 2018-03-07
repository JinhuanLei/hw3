var express = require('express');
var router = express.Router();
var users = require('./users.js');


router.get('/wordgame/api/v2/uid', function(req, res, next) {
    createWordDb();
    var user = req.session.user;
    if( user ) {
        res.json( user );
    } else {
        res.status( 403 ).send( 'Forbidden' );
    }

    // })
});