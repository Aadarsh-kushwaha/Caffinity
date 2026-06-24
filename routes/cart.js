const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const { isLoggedIn } = require("../middleware");

console.log("Cart routes loaded");
 //router.post("/push", cartController.push);
 router.post("/push",isLoggedIn,cartController.push);



module.exports = router;