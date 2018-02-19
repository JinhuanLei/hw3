var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var font = require('../public/module/font');
var colors = require('../public/module/colors');
var metaDb = {};


router.get('/wordgame', function(req, res, next) {
    res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});

router.get('/wordgame/api/v1/meta/fonts', function(req, res, next) {
    var result = [];
    var fontDb =font.getfontDb();
    for( var key in fontDb ) {
        result.push( fontDb[ key ] );
    }
    res.send(result);
});

router.get('/wordgame/api/v1/meta', function(req, res, next) {
    var result = [];
    var dcolor =colors.getdefaultcolor();
    result.push(dcolor);
    res.send(result);
});

module.exports = router;
