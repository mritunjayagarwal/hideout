
module.exports = function(_, passport, async, Tweet, User, moment){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/home', this.homePage);
            router.get('/logout', this.logout);

            router.post('/signup', this.createUser);
            router.post('/home', this.postTweet);
        },
        logout: function(req, res){
            req.logout();
            res.redirect('/');
        },
        indexPage: function(req, res){
            if(req.user){
                const userData = req.user;

            async.parallel([
                function(callback){
                    Tweet.find({})
                        .sort('-created')
                        .populate('owner')
                        .exec((err,tweets) => {
                            callback(err, tweets)
                        })
                },
                function(callback){
                    User.find({})
                        .sort('-_id')
                        .populate('owner')
                        .exec((err,users) => {
                            callback(err, users)
                        })
                }
            ], (err, results) => {
                var result1 = results[0];
                var result2 = results[1];
                res.render('home', {userData: userData, tweets: result1,users: result2, moment: moment});
            })
          }else{
                res.render('index');
          }
        },
        homePage: function(req, res){
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
                res.render('home', {userData: userData, tweets: result1, moment: moment });
            })
        },
        createUser: passport.authenticate('login', {
            successRedirect: '/news',
            failureRedirect: '/',
            failureFlash: true
        }),
        postTweet: function(req, res){
            if(req.body.tweetName != ''){
            async.waterfall([
                function(callback){
                   const tweet = new Tweet();
                   tweet.owner = req.user._id;
                   tweet.content = req.body.tweetName;
                   tweet.save(function(err){
                       callback(err, tweet)
                   })
                },
                function(tweet, callback){
                    User.update({
                        '_id': req.user._id
                    }, {
                        $push: {
                            tweets: {
                                tweet: tweet._id
                            }
                        }
                    }, (err, count) => {
                        callback(err, count);
                    })
                }
            ])
        }
      } 
    }
}