const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const validator = require('express-validator');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');
const compression = require('compression');
const helmet = require('helmet'); 
const container = require('./container');
const moment = require('moment');
const { Users } = require('./helpers/UserClass');

container.resolve(function(users, _, admin, news){

    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true});
    // mongoose.connect('mongodb://golden_jaguar:zoniakk1@ds151124.mlab.com:51124/hide_out', { useNewUrlParser: true});

    const app = showExpress();

    function showExpress(){
        const app = express();
        const server = http.createServer(app);
        const io = socketIo(server);

        configureExpress(app);

        require('./socket/tweet')(io, Users);

        server.listen(process.env.PORT || 8080, function(){
            console.log("Connected To HideOut");
        });

        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        news.SetRouting(router);

        app.use(router);

        app.use(function(req, res){
            res.render('404');
        })

    }

    function configureExpress(app){

        app.use(compression());
        app.use(helmet());

        require('./passport/passport');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true}));
        app.set('view engine', 'ejs');
        app.use(validator());
        app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: process.env.SECRET_KEY,
            store: new MongoStore({ mongooseConnection: mongoose.connection })
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _;
    }
})