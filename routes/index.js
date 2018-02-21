var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var font = require('../public/module/font');
var level = require('../public/module/level');
var colors = require('../public/module/colors');
var metadata = require('../public/module/Metadata');
var readline = require("readline");
var gamesDb={};
var wordDb=[];


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

function createWordDb() {
    var readline = require('readline');
    var fs = require('fs');
    var os = require('os');
    var fReadName = 'public/wordlist.txt';
    var fRead = fs.createReadStream(fReadName);
    var objReadline = readline.createInterface({
        input: fRead,
    });
    var index = 1;
    objReadline.on('line', (line)=>{
        var tmp = 'line' + index.toString() + ':' + line;
    //console.log(index, line);
    wordDb[index-1]=line;
    index++;
});

    objReadline.on('close', ()=>{
        console.log('readline close...');
});

}

function getWord(min,max) {
    while(true) {
        var randomNum= Math.floor(Math.random()*41238);
    if(wordDb[randomNum].length<=max&&wordDb[randomNum].length>=min) {
        return wordDb[randomNum];
    }
    }

}


function createGame(colors,font,level) {
   var target=getWord(level.minLength,level.maxLength);
    //console.log(target);
    var timestamp = Date.parse(new Date());
    var gameObj=new Game(colors,font,"",level,level.rounds,"unfinished",target,timestamp,"","");
    return gameObj;
}


router.get('/wordgame', function(req, res, next) {

    res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});

router.get('/wordgame/api/v1/sid', function(req, res, next) {
   // req.session.regenerate(function (err) {
   //     console.log(req.session);
    createWordDb();
    gamesDb[req.sessionID]=[];
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

router.get('/wordgame/api/v1/:sid', function(req, res, next) {

    var result =gamesDb[req.params.sid];
    console.log(result);
    console.log("------------------------------------");
    res.send(result);

});

router.post('/wordgame/api/v1/:sid', function(req, res, next) {
    var colorObj=colors.createColorObj(req.body.guesscolor,req.body.forecolor,req.body.wordcolor)
   var fontObj=font.searchFont(req.body.font);
    console.log(req.body.font);
    var levelObj=level.getLevelObj(req.body.level)
    var result=createGame(colorObj,fontObj,levelObj);
    gamesDb[req.params.sid].push(result);
    res.send(result);
});

module.exports = router;
