var express = require('express');
var router = express.Router();
var db=require("./db")

router.get('/wordgame/api/v/admins/users', function(req, res, next) {

    db.collection('User').find().toArray(function (err, users) {
        res.send(users);
    });

})

module.exports = router;