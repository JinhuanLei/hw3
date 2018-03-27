var express = require('express');
var router = express.Router();
var db=require("./db")
var ObjectId = require('mongodb').ObjectID;
router.get('/wordgame/api/admins/v3/users', function(req, res, next) {

    db.collection('User').find().toArray(function (err, users) {
        res.send(users);
    });

})

router.get('/wordgame/api/admins/v3/:uid', function(req, res, next) {
    var uid=req.params.uid;

    db.collection('User').findOne({_id:ObjectId(uid)},function (err, user) {
        if(err){
            res.send("error");
        }else{
            res.send(user);
        }

    });




})

module.exports = router;