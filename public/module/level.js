var express = require('express');
var router = express.Router();

function level(name,minLength,maxLength,rounds) {
    this.name=name;
    this.minLength=minLength;
    this.maxLength=maxLength;
    this.rounds=rounds;
}

var levelDb={};
var defaultlevel=new level("medium",4,10,7);
var easy=new level("easy",3,5,8);
var hard=new level("hard",9,300,6);
levelDb[0]=easy;
levelDb[1]=defaultlevel;
levelDb[2]=hard;

function getDefaultLevel() {
    return defaultlevel;
}

function gettLevelList() {
    return levelDb;
}

function getLevelObj(name)
{
    for( var k=0;k<3;k++ ) {
      if(levelDb[k].name==name)
      {
          return levelDb[k];
      }
    }
    return 0;
}

module.exports.getDefaultLevel = getDefaultLevel;
module.exports.getLevelObj = getLevelObj;
module.exports.gettLevelList = gettLevelList;