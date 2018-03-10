var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var font = require('../public/module/font');
var level = require('../public/module/level');
var colors = require('../public/module/colors');
var metadata = require('../public/module/Metadata');
var readline = require("readline");
var ObjectId = require('mongodb').ObjectID;
var users = require('./users.js');
var gamesDb=[];
var wordDb=[];
var db=require("./db")


function Game( uid,colors, font, guesses,level,remaining,status,target,timestamp,timeToComplete,view ) {
    this._id = uuid();
    this.userId=uid;
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
    // var readline = require('readline');
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
        //console.log('readline close...');
    });

}

function getWord(min,max) {
    while(true) {
        var randomNum= Math.floor(Math.random()*wordDb.length);
        //console.log("randomNum"+randomNum);
        if(wordDb[randomNum].length<=max&&wordDb[randomNum].length>=min) {
            return wordDb[randomNum];
        }
    }

}


function createGame(uid,colors,font,level) {
    var target=getWord(level.minLength,level.maxLength);
    var timestamp = Date.parse(new Date());
    var view="";
    for(var x=0;x<target.length;x++) {
        view+="_";
    }

    var gameObj=new Game(uid,colors,font,"",level,level.rounds,"unfinished",target,timestamp,"",view);
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



router.get('/wordgame/api/v2/meta/fonts', function(req, res, next) {
    var result = [];
    var fontDb =font.getfontDb();
    //users.save();
    // for(var x in fontDb){    //insert Font
    //     db.collection("Font").insertOne(fontDb[x],function (err,font) {
    //
    //     })
    // }
    for( var key in fontDb ) {
        result.push( fontDb[ key ] );
    }
    res.send(result);
});

router.get('/wordgame/api/v1/meta', function(req, res, next) {  //twice
    createWordDb();
    //users.save();
    //var resultmeta = [];
    var metadataObj=metadata.getMetadataobj()
    //console.log(metadataObj);
    var user=req.session.user;
    if(user){
metadataObj.defaults=user.defaults;
            res.send(metadataObj);

    }
   else{
        res.redirect("/wordgame");  //??
    }

});

router.get('/wordgame/api/v1/:userid', function(req, res, next) {
var uid=req.params.userid;
if(!req.session.user){
   res.send("expired");
   return;
}
    db.collection('Game').find({userId:uid}).toArray(function(err,users){
        res.send(users);
    });




});

router.post('/wordgame/api/v1/:userid', function(req, res, next) {
    var colorObj=colors.createColorObj(req.body.guesscolor,req.body.forecolor,req.body.wordcolor)
    var fontObj=font.searchFont(req.body.font);
    var uid=req.params.userid;
    var levelObj=level.getLevelObj(req.body.level)
    var result=createGame(uid,colorObj,fontObj,levelObj);
      var defaultsObj={};
      defaultsObj.font=fontObj;
      defaultsObj.colors=colorObj;
      defaultsObj.level=levelObj;
      var user=req.session.user;
      if(user){
          user.defaults=defaultsObj;
          req.session.user=user;
         // console.log(user);
          var dbuser={};
          db.collection("User").findOne({_id:ObjectId(uid)},function (err,data) {
             dbuser=data;
              dbuser.defaults=defaultsObj;
              delete  dbuser._id;
              console.log(dbuser);
              db.collection("User").update({_id:ObjectId(uid)},dbuser,function (err,data) {
                  if(err){
                      console.log("err"+err);
                  }else{
                      console.log("success")
                  }
              });
          });
      }else {
          res.send("expired");
          return;
      }
    db.collection("Game").insertOne(result,function (err) {
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })

});



router.post('/wordgame/api/v1/:userid/:gid', function(req, res, next) {
    var guess=req.body.guess;
    var uid=req.body.userid;
    var gid=req.body.gid;
    db.collection('Game').findOne({_id:gid},function (err,game) {
        if((game.guesses).indexOf(guess)==-1){
            var position = findLetter(game.target,guess);
            var view= game.view;
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
            game.view=view;
            console.log("victory:"+view.indexOf("_"))
            if(view.indexOf("_")==-1)
            {

                game.status="victory";
                var timestamp = Date.parse(new Date());
                game.timeToComplete=timestamp;
            }
            game.remaining-=1;
            if(game.remaining==0&&(game.status!="victory"))
            {
                game.status="loss";
                var timestamp = Date.parse(new Date());
                game.timeToComplete=timestamp;
            }
            game.guesses += guess;

            db.collection('Game').update(  { '_id' : gid },game, function(err, updated ) {
                var result=game;
                res.send(result);
            } );
    }else{
            res.send("repeat guess");
        }
    })

    // for(var a=0;a<gamelist.length;a++){
    //     //console.log("-------------------"+gamelist[a].id +"--------"+gid);
    //     //console.log("condition:"+(gamelist[a].id==gid));
    //     if((gamelist[a].id)==(gid)&&((gamelist[a].guesses).indexOf(guess)==-1)){
    //         var position = findLetter(gamelist[a].target,guess);
    //         var view= gamelist[a].view;
    //         String.prototype.replaceAt=function(index, char) {
    //             var a = this.split("");
    //             a[index] = char;
    //             return a.join("");
    //         }
    //         if(position.length>=1){
    //             for(var x=0;x<position.length;x++){
    //                 view = view.replaceAt(position[x], guess);
    //             }
    //         }
    //         console.log("View:"+view +"position:"+position);
    //         gamelist[a].view=view;
    //         console.log("victory:"+view.indexOf("_"))
    //         if(view.indexOf("_")==-1)
    //         {
    //             gamelist[a].status="victory";
    //         }
    //         gamelist[a].remaining-=1;
    //         if(gamelist[a].remaining==0&&(gamelist[a].status!="victory"))
    //         {
    //             gamelist[a].status="loss";
    //         }
    //         gamelist[a].guesses += guess;
    //         //console.log(gamelist[a]);
    //         var result=gamelist[a];
    //         console.log("gamelist length 2:"+gamelist.length);
    //         res.send(result);
    //         return;
    //     }
    //
    // }
    //
    // res.send("repeat guess");

});



router.get('/wordgame/api/v1/:userid/:gid', function(req, res, next) {
    var uid=req.params.userid;
    var gid=req.params.gid;
    // var gamelist = gamesDb[req.params.sid];
    // for (var a = 0; a < gamelist.length; a++) {
    //     if (gamelist[a].id == (req.params.gid)) {
    //         res.send(gamelist[a]);
    //     }
    // }

    db.collection('Game').findOne({_id:gid},function (err,game) {
        if(game.userId==uid){
            res.send(game);
        }else{
            res.send(err);
        }

    })

});





module.exports = router;
