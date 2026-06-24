const User = require("../models/user");
const bcrypt = require("bcrypt");

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

            req.flash("success", "Welcome to Caffinity by MVC!");
            res.redirect("/home");
        });

    } catch (err) {
        res.send("Error: " + err.message);
    }
};