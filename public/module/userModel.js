

function User( email,password,defaults,role,enabled,name) {

    this.email = email;
    this.password = password;
    this.defaults = defaults;
    this.role=role;
    this.enabled=enabled;
    this.name=name;
}

function createUserObj(email,password,defaults,role,enabled,name)
{
    var obj=new User(email,password,defaults,role,enabled,name);
    return obj;
}

module.exports = User;
module.exports.createUserObj = createUserObj;
