
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({'username': username}, (err, user) => {
        if(err){
            return done(null, false, req.flash('error', 'Weak Connectivity'));
        }

        if(user){
            if(user && user.compare(password)){
                done(null, user);
            }
        }

        const newUser = new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.fullname;
        newUser.email = req.body.fullname;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.save(function(err){
            done(err, newUser)
        })
    })
}))