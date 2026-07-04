const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");


 router.post("/signup", usersController.signup);
 router.post("/login", usersController.login);
  router.get("/logout", usersController.logout);
  router.post("/contact", usersController.contact);





module.exports = router;