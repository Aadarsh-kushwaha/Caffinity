const express = require("express");
const router = express.Router();

const coffeesController = require("../controllers/render");


router.get("/home", coffeesController.home);
router.get("/menu", coffeesController.menu);
router.get("/about", coffeesController.about);
router.get("/contact", coffeesController.contact);

router.get("/product/:id", coffeesController.showProduct);
router.get("/login", coffeesController.login);
router.get("/signup", coffeesController.signup);



module.exports = router;