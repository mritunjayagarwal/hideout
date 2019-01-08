
module.exports = function(){
    return {
        SetRouting: function(router){
            router.get('/dashboard', this.dashboard);
        },
        dashboard: function(req, res){
            res.render('admin/dashboard');
        }
    }
}