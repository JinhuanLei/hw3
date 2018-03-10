var express = require('express');
var router = express.Router();
var font = require('./font');
var colors = require('./colors');
var level = require('./level');

function defaults(font,level,colors) {
    this.font = font;
    this.level = level;
    this.colors=colors;
}

var defaultsobj=new defaults(font.getDefaultFont(),level.getDefaultLevel(),colors.getdefaultcolor());

function getDefaultobj() {
    return defaultsobj;
}

module.exports.getDefaultobj = getDefaultobj;