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
        var randomNum= Math.floor(Math.random()*wordDb.length);
    if(wordDb[randomNum].length<=max&&wordDb[randomNum].length>=min) {
        return wordDb[randomNum];
    }
    }

}


function createGame(colors,font,level) {
   var target=getWord(level.minLength,level.maxLength);
    var timestamp = Date.parse(new Date());
    var view="";
    for(var x=0;x<target.length;x++) {
       view+="_";
    }

    var gameObj=new Game(colors,font,"",level,level.rounds,"unfinished",target,timestamp,"",view);
    return gameObj;
}

function findLetter(str,subStr) {
    var positions = new Array();
        var pos = str.indexOf(subStr);
        while(pos>-1){
            positions.push(pos);
            pos = str.indexOf(subStr,pos+1);
        }

    return positions;
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


router.post('/wordgame/api/v1/:sid/:gid', function(req, res, next) {
    var guess=req.body.guess;
    var gamelist=gamesDb[req.body.sid];
    for(var a=0;a<gamelist.length;a++){
       // console.log("-------------------"+gamelist[a].id +"--------"+req.body.sid);
        if(gamelist[a].id==(req.body.gid)&&gamelist[a].guesses.indexOf(guess)==-1){
           var position = findLetter(gamelist[a].target,guess);
            var view= gamelist[a].view;
            String.prototype.replaceAt=function(index, char) {
                var a = this.split("");
                a[index] = char;
                return a.join("");
            }
           if(position.length>=1){
               for(var x=0;x<position.length;x++){
                   view = view.replaceAt(position[x], guess);
               }
           }
             console.log("View:"+view +"position:"+position);
           gamelist[a].view=view;
            if(view.indexOf("_")==-1)
            {
                gamelist[a].status="victory";
            }
            gamelist[a].remaining-=1;
            if(gamelist[a].remaining==-1&&!(gamelist[a].status="victory"))
            {
                gamelist[a].status="loss";
            }
            gamelist[a].guesses += guess;
            //console.log(gamelist[a]);
             res.send(gamelist[a]);
        }
        else{
            res.send("repeat guess");
        }
    }

});


module.exports = router;
