var express = require('express');
var router = express.Router();

function colors(guessBackground,textBackground,wordBackgroud) {
  this.guessBackground=guessBackground;
  this.textBackground=textBackground;
  this.wordBackground=wordBackgroud;
}

var colorsDb={};
var c1=new colors("#FFFFFF","#000000","#777777");


function getdefaultcolor() {
    return c1;
}

function createColorObj(guess,text,word)
{
    var obj=new colors(guess,text,word);
    return obj;
}

module.exports.getdefaultcolor = getdefaultcolor;
module.exports.createColorObj = createColorObj;

