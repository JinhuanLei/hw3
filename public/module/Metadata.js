var express = require('express');
var router = express.Router();
var level = require('./level');
var font=require('./font');
var defaults=require('./defaults');
function metadata(font,level,defaults) {
    this.fonts = font;
    this.levels = level;
    this.defaults=defaults;
}

var metadataobj= new metadata(font.getfontDb(),level.gettLevelList(),defaults.getDefaultobj());

function getMetadataobj()
{
    return metadataobj;
}

module.exports.getMetadataobj= getMetadataobj;
