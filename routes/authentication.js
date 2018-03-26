var express = require('express');
var router = express.Router();

var db=require("./db")
var uuid = require('uuid');

router.get('/wordgame/api/v/uid', function(req, res, next) {

    var user = req.session.user;
    console.log(req);
    if( user ) {
        res.json( user );
    } else {
        res.status( 403 ).send( 'Forbidden' );
    }
});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


var csrftoken;
router.post('/wordgame/api/v4/login',function (req,res,next) {
             var email=req.body.email;
             var password=req.body.password;
             if(!validateEmail(email))
             {
                 res.status(403).send('invalid2');
                 console.log("Invalid Email");
                 return;
             }
    req.session.regenerate( function( err ) {
        db.collection("User").findOne({email: email}, function (err, user) {
            if (user && user.password == password) {
                req.session.user = user;
                delete user.password;
                csrftoken=uuid();
                res.set({
                    //'Set-Cookie': 'mycookiesid='+req.sessionID,
                    "CSRF-Token":csrftoken
                });
                res.send(user);
            }
            else {
                res.status(403).send('Forbidden');
            }
        });
    });
})

router.post('/wordgame/api/v4/logout',function (req,res,next) {
   req.session.destroy();
   res.send("success");

})

module.exports = router;