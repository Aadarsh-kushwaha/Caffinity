
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const bcrypt = require("bcrypt");


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

      
        const isMatch = await bcrypt.compare(
         password,
         user.password
        );

        if (!isMatch) {
           return done(null, false);
          }           

        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  )
);

