
module.exports = function(Tweet, _, async, User){
    return {
        SetRouting: function(router){
            router.get('/news', this.newsPage);

            router.post('/postNews', this.PostNews);
        },
        newsPage: function(req, res){
            const userData = req.user;

            async.parallel([
                function(callback){
                    Tweet.find({})
                        .sort('-created')
                        .populate('owner')
                        .exec((err,tweets) => {
                            callback(err, tweets)
                        })
                }
            ], (err, results) => {
                var result1 = results[0];
                console.log(result1);
                res.render('news', {userData: userData, tweets: result1});
            });
        },
        PostNews: function(req, res){
            async.waterfall([
                function(callback){
                    const newTweet = new Tweet();
                    newTweet.owner = req.user._id;
                    newTweet.content = req.body.description;
                    newTweet.heading = req.body.heading;
                    newTweet.save(function(err){
                        callback(err, newTweet)
            })
                },
                function(newTweet, callback){
                    User.update({
                        '_id': req.user._id
                    },{
                        $push:{
                            tweets: {
                                tweet: newTweet._id 
                            }
                        }
                    }, (err, count) => {
                        callback(err, count)
                        res.redirect('/news');
                    })
                }
            ])
        }
    }
}