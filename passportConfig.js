
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");


passport.use(
  new LocalStrategy(
    async (username, password, done) => {
      try {

          console.log("Username:", username);

      const user = await User.findOne({ email: username });

      console.log("User:", user);

        if (!user) {
          return done(null, false);
        }

        if (user.password !== password) {
          return done(null, false);
        }

        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  )
);



// // passportConfig.js
// const express = require("express");
// const mongoose = require("mongoose");
// const SchemAa = mongoose.Schema;
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user");
// const { message } = require("./schemas/contactSchema");
// const LocalStrategy = require('passport-local').Strategy;

// app.use(passport.initialize());
// app.use(passport.session());


// passport.use(new LocalStrategy(
//     function(username,password, done){
//         console.log(username, password);
//         User.findOne({username : username},function(err,user){
//             if(err){ return done(err) ;}
//             if(!user){
//                 return done(null , false , {message : 'Incorrect username.'});
//             }
//             if(!user.validPassword(passport)){
//                 return done(null , false ,{message : 'Incorrect password'});
//             }
//             return done(null, user);

//         })
//     }
// ));

// passport.serializeUser(User.serializeUser());

// passport.deserializeUser(User.deserializeUser());

// app.post('/login',
//   passport.authenticate('local'),
//   function(req, res) {
//     res.redirect('/users');
//   });
