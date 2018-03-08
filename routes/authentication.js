var express = require('express');
var router = express.Router();
var users = require('./users.js');
var db=require("./db")
var uuid = require('uuid');

router.get('/wordgame/api/v2/uid', function(req, res, next) {

    var user = req.session.user;
    if( user ) {
        res.json( user );
    } else {
        res.status( 403 ).send( 'Forbidden' );
    }
});


router.post('/wordgame/api/v2/login',function (req,res,next) {
             var email=req.body.email;
             var password=req.body.password;
    req.session.regenerate( function( err ) {
        db.collection("User").findOne({email: email}, function (err, user) {
            if (user && user.password == password) {
                req.session.user = user;
                delete user.password;
                res.set({
                    //'Set-Cookie': 'mycookiesid='+req.sessionID,
                    "CSRF-Token":uuid()
                });
                res.send(user);
            }
            else {
                res.status(403).send('Forbidden');
            }
        });
    });
})

router.post('/wordgame/api/v2/logout',function (req,res,next) {
   req.session.destroy();
   res.send("success");

})

module.exports = router;