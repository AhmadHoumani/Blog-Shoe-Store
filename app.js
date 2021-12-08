const express = require ('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
require('./config/passport')(passport);
mongoose.connect('mongodb://localhost:27017/testdb',{useNewUrlParser:true,useUnifiedTopology:true})
const db=mongoose.connection
db.on('error',(err)=>{
    console.log(err)
}) 
db.once('open',()=>{
    console.log("Database Connected")
})

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');  
//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//Express Session 
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

 // Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  app.use(flash());

  // Global variables for Flash 
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
// app.use('/',express.static(path.join(__dirname,'static')));
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`Server list ening on Port: ${PORT}`));