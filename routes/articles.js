const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Article model
let Article = require('../models/article');
// User model
let User = require('../models/user');

// Add route
router.get('/add', ensureAuthenticated, function(req, res) {
  res.render('add_article', {
    title:'Add article'
  });
});

// Submit route (withMessage logs server-side)
router.post('/add',
 [
  check('title').isLength({min:1}).trim().withMessage('Title required'),
  check('body').isLength({min:1}).trim().withMessage('Body required')
 ],
  (req,res,next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    res.render('add_article',
      {
        title:'Add article',
        errors: errors.mapped()
      });
  }
  else {
    let article = new Article({
      title:req.body.title,
      author:req.user._id,
      body:req.body.body
    });

    article.save(err=>{
      if(err) throw err;
      req.flash('success','Article Added');
      res.redirect('/');
    });
  }
});

// Load edit form
// TODO crash if another user clicks on edit link... !
router.get('/edit/:id', ensureAuthenticated, function(req,res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'Not authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

// Update Submit route
router.post('/edit/:id', [
  check('title').isLength({min:1}).trim().withMessage('Title required'),
  check('author').isLength({min:1}).trim().withMessage('Author required'),
  check('body').isLength({min:1}).trim().withMessage('Body required')
 ],
  (req,res,next) => {

  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id};

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    req.flash('danger', 'Invalid update');
    res.redirect('/');
  }
  else {
    Article.update(query, article, function(err){
      if(err){
        console.log(err);
        return;
      }
      else {
        req.flash('success', 'Article updated');
        res.redirect('/');
      }
    });
  };
});

// Delete
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id};

  Article.findById(req.params.id, function(err, article){
    if (article.author != req.user._id){
      res.status(500).send();
    }
    else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get single article
router.get('/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      res.render('article', {
        article:article,
        author:user.name
      });
    });
  });
});

// Access controls
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
