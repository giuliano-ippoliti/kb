const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Bring in Article model
let User = require('../models/user');

// Register form
router.get('/register', function(req, res){
  res.render('register');
});

// Register process
router.post('/register',
[
  check('name', 'Name is required').isLength({min: 1}),
  check('email', 'Email is required').isLength({min: 1}),
  check('email', 'Email is not valid').isEmail(),
  check('username', 'Username is required').isLength({min: 1}),
  check('password', 'Password is required').isLength({min: 1}),
  check('password2', 'Please confirm password').custom((value, {req, loc, path}) => {
    if (value !== req.body.password) {
      throw new Error("Passwords don't match");
    }
    else {
      return value;
    }
  })
 ],
 (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()){
     console.log('There were errors:', errors)  // TODO render doesn't show errors
     res.render('register', {
       errors:errors
     });
   }
   else {
     let newUser = new User({
       name:req.body.name,
       email:req.body.email,
       username:req.body.username,
       password:req.body.password
     });

     bcrypt.genSalt(10, function(err, salt){
       bcrypt.hash(newUser.password, salt, function(err, hash){
         if(err){
           console.log(err);
         }
         newUser.password = hash;
         newUser.save(function(err){
           if(err) {
             console.log(err);
             return;
           }
           else {
             req.flash('success', 'You are now registered and can log in');
             res.redirect('/users/login');
           }
         })
       });
     });
   }
});

router.get('/login', function(req,res){
  res.render('login');
});

module.exports = router;
