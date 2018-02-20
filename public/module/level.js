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
var hard=new level("medium",9,300,6);
levelDb[0]=easy;
levelDb[1]=defaultlevel;
levelDb[2]=hard;

function getDefaultLevel() {
    return defaultlevel;
}

function gettLevelList() {
    return levelDb;
}

module.exports.getDefaultLevel = getDefaultLevel;
module.exports.gettLevelList = gettLevelList;