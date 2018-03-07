var db = require('./db');
var User = require('./userModel');
var mongo = require('mongodb');
function init( cb ) {
    var saved = 0;
    var result = [];
    const userDb = [["bilbo", "baggins"], ["frodo", "baggins"], ["samwise", "gamgee"], ["gandalf", "gray"]].forEach( names => {
        var user = new User( names[0], names[1], names[0] + "@mordor.org", "123", true );
    save( user, (err, newUser) => { result.push(newUser);  if(result.length == 4) cb( null, result ); } );
} );
};
module.exports.init = init;


function save( user, cb ) {
    db.collection('users').save(user, function( err1, writeResult ) {
        db.collection('users').findOne( user, function( err2, savedUser ) {
            cb( err1 || err2, savedUser );
        } );
    } );
}
module.exports.save = save;




module.exports = router;
