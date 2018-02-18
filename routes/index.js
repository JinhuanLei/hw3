var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});


router.get('/page', function(req, res, next) {
    console.log("Work!!!!!!!!")
    res.send('respond with a resource');
});

module.exports = router;
