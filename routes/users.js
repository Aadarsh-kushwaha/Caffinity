const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");


 router.post("/signup", usersController.signup);
 router.post("/login", usersController.login);
  router.get("/logout", usersController.logout);



module.exports = router;