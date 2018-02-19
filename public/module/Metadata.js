var express = require('express');
var router = express.Router();
var level = require('./level');

function defaults(font,level,colors) {
    this.font = font;
    this.level = level;
    this.colors=colors;
}
