var express = require('express');
var router = express.Router();
var db = require('./db');
var User = require('../public/module/userModel.js');
var mongo = require('mongodb');
var metadata = require('../public/module/Metadata');

function save(){
    db.collection('User').find().toArray(function (err,users) {
        for(var x in users){

            users[x].defaults=metadata.getMetadataobj().defaults;
            //console.log(users[x])
            var result=users[x];
            delete result._id;
            db.collection('User').insertOne(result,function(err, updated ) {
            if(err){
                console.log("err"+err);
            }else{
                console.log("success"+result.defaults.font.url);
            }
            });
        }
    })

}
module.exports.save = save;
