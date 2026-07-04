const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const { isLoggedIn } = require("../middleware");
const { validateContact } = require("../middleware");

 //router.post("/push", cartController.push);
 router.get("/", isLoggedIn, cartController.show);
 router.post("/push",isLoggedIn,cartController.push);
 router.get("/show",isLoggedIn,cartController.show);

 // DELETE /cart/:productId
router.delete("/:productId",isLoggedIn,cartController.delete);
router.put("/increase/:productId",isLoggedIn,cartController.increaseQuantity);
router.put("/decrease/:productId",isLoggedIn,cartController.decreaseQuantity);

 router.get("/checkout",isLoggedIn,cartController.checkout);
 router.post("/totalSummary",isLoggedIn,cartController.totalSummary);



module.exports = router;