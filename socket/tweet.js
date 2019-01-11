const async = require('async');
const Tweet = require('../models/tweet');
const User = require('../models/user');

module.exports = function(io, Users){

    var users = new Users();

    io.on('connection', (socket) => {
        console.log('Io Connection Successful');

        socket.on('join', (params, callback) => {
            socket.join(params.room);

            users.AddUserData(socket.id, params.name, params.room);

            io.to(params.room).emit('watching', users.GetUserData(params.room));

            callback();
        })
    
        socket.on('tweet', (data, callback) => {
            io.emit('newTweet', {
                tweet: data.tweet,
                sender: data.sender,
                image: data.senderImage
            });
            callback();
        });

        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);
            if(user){
                io.to(user.room).emit('watching', users.GetUserData(user.room));
            }
        })
    })
}