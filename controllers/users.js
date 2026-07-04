const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require('passport');
const Query = require("../models/query");

module.exports.signup = async (req, res, next) => {
    try {
        const { name, age, email, mobile, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.send("Passwords does not match");
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.send("Email already registered");
        }

          const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            age,
            email,
            mobile,
            password: hashedPassword
        });

        await newUser.save();

        req.login(newUser, (err) => {
            if (err) {
                console.log(err);
                return next(err);
            }

            req.flash("success", "Welcome to Caffinity!");
            res.redirect("/render/home");
        });

    } catch (err) {
        res.send("Error: " + err.message);
    }
};


module.exports.login = passport.authenticate("local", {
    successRedirect: "/render/home",
    failureRedirect: "/render/login",
    failureFlash: "Invalid email or password"
});

module.exports.logout =  (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.flash("success", "Logged out successfully!");

    req.session.destroy(err => {
      if (err) return next(err);

      res.clearCookie('connect.sid');
      res.redirect('/render/home');
    });
  });
};


module.exports.contact = async(req, res) => {
 try{
  const {name,email,mobile,issue , source , message } = req.body;
  const newQuery = new Query({
    name,
    email,
    mobile,
    issue,
    source,
    message,
  });
 
 await newQuery.save();
 
req.flash("success", "Your response is recorded");

return res.redirect("/render/contact");

 }catch(err){
  res.send("Error:" + err.message);
 }
};