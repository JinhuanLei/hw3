var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var font = require('../public/module/font');
var level = require('../public/module/level');
var colors = require('../public/module/colors');
var metadata = require('../public/module/Metadata');
var gamesDb={};


function Game( colors, font, guesses, level,remaining,status,target,timestamp,timeToComplete,view ) {
    this.id = uuid();
    this.colors = colors;
    this.font = font;
    this.guesses=guesses;
    this.level=level;
    this.remaining=remaining;
    this.status=status;
    this.target=target;
    this.timestap=timestamp;
    this.timeToComplete=timeToComplete;
    this.view=view;
}

function createGame(colors,font,level) {

    //var gameObj=new Game(colors,font,);
    var fs = require('fs');

    fs.readFile('public/wordlist.txt', function(err, data) {
        console.log(String.fromCharCode(data[2]));
    })
    return 1;
}


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
    var colorObj=colors.createColorObj(req.body.guesscolor,req.body.forecolor,req.body.wordcolor)
   var fontObj=font.searchFont(req.body.font);
    var levelObj=level.getLevelObj(req.body.level)
    var result=createGame(colorObj,fontObj,levelObj);
    res.send(colorObj);
});

module.exports = router;
