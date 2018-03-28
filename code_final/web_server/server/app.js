var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var passport = require('passport');
var path = require('path');

//Routers
var auth = require('./routes/auth');
var index = require('./routes/index');
var news = require('./routes/news');

var app = express();

var config = require('./config/config.json');
require('./models/main.js').connect(config.mongoDbUri);

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, '../client/build/'));
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

//Todo: remove this after development is done
//app.all('*', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
 //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
 //   next();
//});
app.use(cors());

//load passport strategies
app.use(passport.initialize());
var localSignUpStrategy = require('./passport/signup_passport');
var localLoginStrategy = require('./passport/login_passport');
passport.use('local-signup', localSignUpStrategy);
passport.use('local-login', localLoginStrategy);

const authChecker = require('./middleware/auth_checker');

app.use('/', index);
app.use('/auth', auth);
app.use('/news', authChecker);
app.use('/news', news);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
   res.status(404);
});


module.exports = app;
