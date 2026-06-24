// const express = require("express");
// const passport = require("passport");
// const router = express.Router();

// const authController = require("../controllers/auth");

// // Google Login
// router.get(
//     "/google",
//     passport.authenticate("google", {
//         scope: ["email", "profile"]
//     })
// );

// // Google Callback
// router.get(
//     "/google/callback",
//     passport.authenticate("google", {
//         failureRedirect: "/auth/failure"
//     }),
//     authController.googleCallback
// );

// // Failure
// router.get(
//     "/failure",
//     authController.authFailure
// );

// module.exports = router;