var express = require('express');
var router = express.Router();
var users = require('./users.js');
var db=require("./db")


router.post('/wordgame/api/v2/login',function (req,res,next) {
             var email=req.body.email;
             var password=req.body.password;

    db.collection("User").findOne({email:email},function (err,user) {
                if(user&&user.password==password)
                {
                    req.session.user=user;
                    res.send(user);
                }
                else{
                    res.status( 403 ).send( 'Forbidden' );
                }
    })

})

router.post('/wordgame/api/v2/logout',function (req,res,next) {
   req.session.destroy();
   res.send("success");

})

module.exports = router;