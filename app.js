const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator =require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

// new api @ https://express-validator.github.io/docs/
const { check, validationResult } = require('express-validator');

// Connect to db
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

// Check for db errors
db.on('error', function(err) {
  console.log(err);
});

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Init app
const app = express();

// Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Bring in Article model
let Article = require('./models/article');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Passport config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Home route
app.get('/', (req, res) => {
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }
    else {
      res.render('index', {
        title:'Articles',
        articles:articles
      });
    };
  });
});

// Route file
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// Start server
app.listen(3000, () => {
  console.log('Server startd on port 3000...');
});
