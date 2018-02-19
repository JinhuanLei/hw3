var express = require('express');
var router = express.Router();


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

var thingsDb = {};



/**************** ROUTES ***********************************/

module.exports = router;