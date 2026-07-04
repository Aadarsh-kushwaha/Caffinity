require('dotenv').config();

const User = require("./models/user"); // path ko check karo, agar User.js models folder me hai
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://daily-drip-sable.vercel.app/google/callback",
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                let existingUser = await User.findOne({ email: profile.emails[0].value });

                if (existingUser) {
                    return done(null, existingUser);
                }

                // Naya user create karna
                const newUser = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                });

                await newUser.save();
                done(null, newUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
passport.serializeUser((user, done) => {
  done(null, user._id);   // ✅ sirf id store hogi
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);     // ✅ har request pe fresh user
  } catch (err) {
    done(err, null);
  }
});