class Users{
    constructor(){
        this.users = [];
    }

    AddUserData(id, name, room){
        var users = { id, name, room};
        this.users.push(users);
        return users;
    }
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
        this.users = this.users.filter((user) => user.id !== id)
        }
        return user;
    }


    GetUser(id){
        var user = this.users.filter((userId) => {
            return userId.id == id;
        })[0];
        return user;
    }

    GetUserData(room){
        var user = this.users.filter((user) => user.room === room);
        var nameArray = user.map((user) => {
            return user.name;
        });
        return nameArray;
    }
}

module.exports = { Users } 