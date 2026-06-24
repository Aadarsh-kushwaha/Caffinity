const Cart = require("../models/cart");

module.exports.push =   async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
  


    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    let item = cart.items.find(i =>
      i.productId.toString() === productId.toString()
    );

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
      
    }

    await cart.save();
    req.flash("success", "Product Added To Cart");

   res.redirect("/menu");

  } catch (err) {
    console.log("ERROR:", err);
    res.send("Error ❌");
  }
};