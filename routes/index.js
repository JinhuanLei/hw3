var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var font = require('../public/module/font');
var metadata = require('../public/module/Metadata');


router.get('/wordgame', function(req, res, next) {
    res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});

router.get('/wordgame/api/v1/sid', function(req, res, next) {
   // req.session.regenerate(function (err) {
   //     console.log(req.session);
   //
       res.send(req.sessionID);
   // })
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
    var resultmeta = [];
    var metadataObj =metadata.getMetadataobj();
    // result.push(metadataObj);
    resultmeta.push(metadataObj);
    res.send(resultmeta);
});

router.post('/wordgame/api/v1/:sid', function(req, res, next) {
    var resultmeta = [];
    var metadataObj =metadata.getMetadataobj();
    // result.push(metadataObj);
    resultmeta.push(metadataObj);
    res.send(resultmeta);
});

module.exports = router;
