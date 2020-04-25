const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

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

// Add route
app.get('/articles/add', function(res, res) {
  res.render('add_article', {
    title:'Add article'
  });
})

// Start server
app.listen(3000, () => {
  console.log('Server startd on port 3000...');
});
