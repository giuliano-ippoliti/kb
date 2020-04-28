const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator =require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

// Connect to db
mongoose.connect('mongodb://localhost/nodekb', {useNewUrlParser: true, useUnifiedTopology: true});
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
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Bring in Models
let Article = require('./models/article');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
    }
  });
});

// Get single article
app.get('/article/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article:article
    });
  });
});

// Add route
app.get('/articles/add', function(res, res) {
  res.render('add_article', {
    title:'Add article'
  });
});

// Submit route
app.post('/articles/add', function(req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }
    else {
      res.redirect('/');
    }
  })
});

// Load edit form
app.get('/article/edit/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

// Update Submit route
app.post('/articles/edit/:id', function(req, res) {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id};

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }
    else {
      res.redirect('/');
    }
  })
});

// Delete
app.delete('/article/:id', function(req, res){
  console.log('delete');
  let query = {_id:req.params.id};

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server startd on port 3000...');
});
