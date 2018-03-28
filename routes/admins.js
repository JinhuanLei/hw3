var express = require('express');
var router = express.Router();
var db=require("./db")
var bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectID;
var userModel=require('../public/module/userModel');
router.get('/wordgame/api/admins/v3/users', function(req, res, next) {

    db.collection('User').find().toArray(function (err, users) {
        res.send(users);
    });

})

function encryptPsw(password) {

    const saltRounds = 10;
    //随机生成salt
    const salt = bcrypt.genSaltSync(saltRounds);
    //获取hash值
    var hash = bcrypt.hashSync(password, salt);
    //把hash值赋值给password变量
    password = hash;
    return password
}

router.post('/wordgame/api/admins/v3/users', function(req, res, next) {
var first=req.body.first;
var last=req.body.last;
var email=req.body.email;
var role=req.body.role;
var enabled=req.body.enabled;
var password=req.body.password;
password=encryptPsw(password);
   var name={};
   name.first=first;
   name.last=last;
var userObj=userModel.createUserObj(email,password,"",role,enabled,name);
    db.collection("User").insertOne(userObj,function (err) {
        if(err){
            res.send(err);
        }else{
            delete userObj.password;
            res.send(userObj);
        }
    })
   

})

router.put('/wordgame/api/admins/v3/users', function(req, res, next) {
    var first=req.body.first;
    var last=req.body.last;
    var email=req.body.email;
    var role=req.body.role;
    var enabled=req.body.enabled;
    var uid=req.body.uid;
    var name={};
    name.first=first;
    name.last=last;


    db.collection("User").findOne({_id:ObjectId(uid)},function (err,data) {
       var password=data.password;
        var userObj=userModel.createUserObj(email,password,"",role,enabled,name);
        db.collection("User").update({_id:ObjectId(uid)},userObj,function (err,data) {
            if(err){
                console.log("err"+err);
            }else{
                res.send("success");
            }
        });
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