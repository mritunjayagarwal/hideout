const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    username: { type: String, lowercase: true, unique: true},
    fullname: { type: String, default: ''},
    password: { type: String, default: ''},
    userImage: {  type: String, default: 'default.png'},
    fb: { type: String, default: ''},
    fbToken: Array,
    created: { type: Date, default: Date.now},
    tweets: [{
        tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}
    }],
    sentRequest:{
        username: String
    },
    request:[{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: { type: String, default: ''}
    }],
    friendList: [{
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        friendName: { type: String, default: ''}
    }],
    totalRequests: { type: Number, default: 0}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.compare = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);