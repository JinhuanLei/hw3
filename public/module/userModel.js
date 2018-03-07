

function User( _id, email,password,defaults ) {
    this._id = _id,
    this.email = email;
    this.password = password;
    this.defaults = defaults;
}

module.exports = User;
