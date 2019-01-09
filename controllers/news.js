
module.exports = function(Tweet, _, async, User, moment, News){
    return {
        SetRouting: function(router){
            router.get('/news', this.newsPage);

            router.post('/postNews', this.PostNews);
        },
        newsPage: function(req, res){
            const userData = req.user;

            async.parallel([
                function(callback){
                    News.find({})
                        .sort('-created')
                        .populate('owner')
                        .exec((err,news) => {
                            callback(err, news)
                        })
                }
            ], (err, results) => {
                var result1 = results[0];
                res.render('news', {userData: userData, news: result1, moment: moment});
            });
        },
        PostNews: function(req, res){
            async.waterfall([
                function(callback){
                    const newNews = new News();
                    newNews.owner = req.user._id;
                    newNews.content = req.body.description;
                    newNews.heading = req.body.heading;
                    newNews.save(function(err){
                        callback(err, newNews)
            })
                },
                function(newNews, callback){
                    User.update({
                        '_id': req.user._id
                    },{
                        $push:{
                            tweets: {
                                tweet: newNews._id 
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