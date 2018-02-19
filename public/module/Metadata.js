var express = require('express');
var router = express.Router();
var level = require('./level');
var font= require('./font');
var defaults=require('./defaults')
function metadata(fonts,levels,defaults) {
    this.fonts = fonts;
    this.levels = levels;
    this.defaults=defaults;
}

metadataobj=new metadata(font.getfontDb(),level.gettLevelList(),defaults.getDefaultobj());

function getMetadata() {
    return metadataobj;
}

module.exports.getMetadata = getMetadata;