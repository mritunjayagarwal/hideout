const async = require('async');
const Tweet = require('../models/tweet');
const User = require('../models/user');

module.exports = function(io){
    io.on('connection', (socket) => {
        console.log('Io Connection Successful');

        socket.on('tweet', (data, callback) => {
            io.emit('newTweet', {
                tweet: data.tweet,
                sender: data.sender,
                image: data.senderImage
            });
            callback();
        })
    })
}