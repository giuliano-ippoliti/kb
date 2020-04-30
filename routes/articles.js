const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Bring in Article model
let Article = require('../models/article');

// Add route
router.get('/add', function(res, res) {
  res.render('add_article', {
    title:'Add article'
  });
});

// Submit route (withMessage logs server-side)
router.post('/add',
 [
  check('title').isLength({min:1}).trim().withMessage('Title required'),
  check('author').isLength({min:1}).trim().withMessage('Author required'),
  check('body').isLength({min:1}).trim().withMessage('Body required')
 ],
  (req,res,next) => {

  let article = new Article({
    title:req.body.title,
    author:req.body.author,
    body:req.body.body
  });

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
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(err=>{
      if(err) throw err;
      req.flash('success','Article Added');
      res.redirect('/');
    });
  }
});

// Load edit form
router.get('/edit/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
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
  console.log('delete');
  let query = {_id:req.params.id};

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

// Get single article
router.get('/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article:article
    });
  });
});

module.exports = router;
