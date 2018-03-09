var express = require('express');
var router = express.Router();


function font(category,family,rule,url) {
    this.category = category;
    this.family = family;
    this.rule = rule;
    this.url=url;
}
var fontDb={};
f1=new font("Anton","sans-serif"," 'Anton', sans-serif","https://fonts.googleapis.com/css?family=Anton");
f2=new font("Bellefair","serif"," 'Bellefair', serif","https://fonts.googleapis.com/css?family=Bellefair");
f3=new font("Cabin","sans-serif"," 'Cabin', sans-serif","https://fonts.googleapis.com/css?family=Cabin");
f4=new font("Indie Flower","cursive"," 'Indie Flower', cursive","https://fonts.googleapis.com/css?family=Indie Flower");
f5=new font("Kavivanar","cursive"," 'Kavivanar', cursive","https://fonts.googleapis.com/css?family=Kavivanar");
f6=new font("Lato","sans-serif"," 'Lato', sans-serif","https://fonts.googleapis.com/css?family=Lato");
f7=new font("Lobster","cursive"," 'Lobster', cursive","https://fonts.googleapis.com/css?family=Lobster");
f8=new font("Montserrat","sans-serif"," 'Montserrat', sans-serif;","https://fonts.googleapis.com/css?family=Montserrat");
f9=new font("Mukta Mahee","serif"," 'Mukta Mahee', sans-serif","https://fonts.googleapis.com/css?family=Mukta+Mahee");
f10=new font("Open Sans","sans-serif","'Open Sans', sans-serif","https://fonts.googleapis.com/css?family=Open+Sans");
f11=new font("Oswald","sans-serif"," 'Oswald', sans-serif","https://fonts.googleapis.com/css?family=Oswald");
f12=new font("Pacifico","cursive"," 'Pacifico', cursive","https://fonts.googleapis.com/css?family=Pacifico");
f13=new font("Roboto","sans-serif"," 'Roboto', sans-serif","https://fonts.googleapis.com/css?family=Roboto");
f14=new font("Roboto Condensed","sans-serif","'Roboto Condensed', sans-serif;","https://fonts.googleapis.com/css?family=Roboto+Condensed");
f15=new font("Slabo 27px","serif"," 'Slabo 27px', serif","https://fonts.googleapis.com/css?family=Slabo+27px");
f16=new font("Ubuntu","sans-serif","'Ubuntu', sans-serif","https://fonts.googleapis.com/css?family=Ubuntu");

for(var x=1;x<=16;x++)
{
    var obj = eval("f"+x);
    fontDb[x]=obj;
}

function getfontDb() {
    return fontDb;
}

function getDefaultFont() {
    return f13;
}

function searchFont(font) {
    for (var x = 1; x <= 16; x++) {
        if (fontDb[x].category==font) {
            return fontDb[x];
        }

    }
}
module.exports.getfontDb = getfontDb;
module.exports.getDefaultFont = getDefaultFont;
module.exports.searchFont = searchFont;