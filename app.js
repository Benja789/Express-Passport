var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

require("dotenv").config()
//
var app = express();

//passport 
const passport = require('passport');
app.use(passport.initialize())

//middleware para autenticarse con google
const passportOAuth =  require('passport-google-oauth');

//Simula una BD
const emails = ["molina.benjamin70@gmail.com"];
passport.use( "auth-google", //nombre 
  new passportOAuth.OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_CLIENT,
      callbackURL: "http://localhost:3000/auth/google",
    },
    function (accessToken, refreshToken, profile, done) {
      //Verifica si en ñla "BD" existe el email
      const response = emails.includes(profile.emails[0].value);
      // IF EXITS IN DATABASE
      if (response) {
        done(null, profile);
      } else {
        // SAVE IN DATABASE
        emails.push(profile.emails[0].value);
        done(null, profile);
      }
    }
  )
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



//AUTH
app.use("/auth",passport.authenticate("auth-google",{
  scope:[
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ], //Nivel de alcance de la informacion del usuario
  session:false
} ), authRouter)



app.use(logger('dev'));
//Midleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
