const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Login
router.get('/login', (req,res)=>res.render('Login'));
//Sign up
router.get('/Register', (req,res)=>res.render('register'));

//Register handle
router.post('/register',(req,res)=>{
    const{name,email,password,password2}=req.body;
    let errors=[];
    //Check Filds
    if(!name ||!email ||!password ||!password2){
        errors.push({msg:"Please fill All Fields!"})
    }
    //Password match
    if(password!=password2){
        errors.push({msg:"Passwords does not match!"})
    }
    //Pass length
    const len =password.length;
    if (len<6){
        errors.push({msg: "Password less then 6 chars"})
    }
    if(errors.length>0){
        res.render('register',{
        errors, name, email, password, password2
    });
}else{
    //Validation
    User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
});
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(user => {
          req.flash(
            'success_msg',
            'You are now registered and can log in'
          );
          res.redirect('/users/login');
        })
        .catch(err => console.log(err));
    });
  });
}
});
}
});
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
module.exports=router;