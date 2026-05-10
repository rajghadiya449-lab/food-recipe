var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');
var expressEjsLayouts = require('express-ejs-layouts');

// var indexRouter = require('./routes/index');
var recipeRouter = require('./routes/recipeRoutes');
// var usersRouter = require('./routes/users');


var app = express();
    dotenv.config();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser('CookingBlog'));

app.use(session({
    secret: 'cookingBlogSession',
    saveUninitialized: true,
    resave: true
}));



app.use(express.static(path.join(__dirname, 'public')));
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');
// app.use('/', indexRouter);
app.use('/', recipeRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler




// app.listen(2000, () => console.log('connected!!!'))

module.exports = app;
