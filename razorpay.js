const express = require("express");
const router = express.Router();

const Razorpay = require("razorpay");
const Order = require("./models/order");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


router.get("/", async (req, res) => {

    console.log("Session Order ID:", req.session.orderId);

    const orderId = req.session.orderId;

    if (!orderId) {
        return res.redirect("/cart");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        return res.redirect("/cart");
    }

    res.render("cart/payment", { order });
});

module.exports = router;