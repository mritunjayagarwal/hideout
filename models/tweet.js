const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: String,
    created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Tweet', tweetSchema)