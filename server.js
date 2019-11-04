var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require('morgan');
require('dotenv').config()
var path = require("path");

// Authentication packages
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcrypt');

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 8080;
app.set('views', path.join(__dirname, 'views/'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

var options = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'poaiewproiual',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use('/', home);
// app.use('/users', users);

passport.use(new LocalStrategy(
  function (username, password, done) {
    // console.log(username);
    // console.log(password);
    const db = require("./models");
    db.Users.findOne({ where: { username: username } }).then(results => {
      if (results === null) {
        console.log("user does not exist. Please register or try again");
        return done(null, false);
      } else {
        const hash = results.password.toString();
        console.log(results.username);
        console.log(hash);
        console.log(password);
        console.log(results.user_id);
        bcrypt.compare(password, hash, function (err, response) {
          console.log(response);
          if (response) {
            return (null, { user_id: results.user_id });
          } else {
            return (null, false);
          }
        })
      }
    });
  }
));


// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = false;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});



module.exports = app;
