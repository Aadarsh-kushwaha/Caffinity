const Cart = require("../models/cart");
const Order = require("../models/order");

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

  res.redirect("/render/menu");

  } catch (err) {
    console.log("ERROR:", err);
    res.send("Error ❌");
  }
};

module.exports.show =  async (req, res) => {
  try {
    const userId = req.user._id;

    const cartData = await Cart.findOne({ userId })
      .populate("items.productId");

    if (!cartData) {
      return res.render("cart/cart", {
        cart: []
      });
    }

    const cart = cartData.items.map(item => {
      return {
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity
      };
    });

    res.render("cart/cart", {
      cart
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading cart");
  }
};



module.exports.delete = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  await Cart.updateOne(
    { userId },
    {
      $pull: {
        items: { productId: productId }
      }
    }
  );

  req.flash("success", "Product removed from the cart");
  res.redirect("/cart");
};

module.exports.increaseQuantity = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  await Cart.updateOne(
    { userId, "items.productId": productId },
    {
      $inc: { "items.$.quantity": 1 }
    }
  );

  req.flash("success", "Quantity Increased ");

  return res.redirect("/cart");
};

module.exports.decreaseQuantity = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });

  const item = cart.items.find(
    i => i.productId.toString() === productId
  );

  if (!item) {
    return res.redirect("/cart");
  }

  if (item.quantity <= 1) {

    await Cart.updateOne(
      { userId },
      {
        $pull: { items: { productId } }
      }
    );

    req.flash("success", "Product Removed");

  } else {

    await Cart.updateOne(
      { userId, "items.productId": productId },
      {
        $inc: { "items.$.quantity": -1 }
      }
    );

    req.flash("success", "Quantity Decreased");
  }

  return res.redirect("/cart");
};


module.exports.checkout = async (req, res) => {

const cart = await Cart.findOne({
   userId: req.user._id
 
}).populate("items.productId");


if (!cart || cart.items.length === 0) {
  return res.redirect("/cart");
}

let total = 0;

cart.items.forEach(item => {
  total += item.productId.price * item.quantity;
});

    res.render("cart/checkout", { cart, total });
};

module.exports.totalSummary = async (req, res) => {

    const cart = await Cart.findOne({
        userId: req.user._id
    }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
        return res.redirect("/cart");
    }

    let total = 0;
    let orderItems = [];

    for (let item of cart.items) {

        total += item.productId.price * item.quantity;

        orderItems.push({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            image: item.productId.image
        });
    }

    const order = await Order.create({

        userId: req.user._id,

        items: orderItems,

        customer: {
            fullName: req.body.fullName,
            phone: req.body.phone,
            tableNumber: req.body.tableNumber,
            instructions: req.body.instructions
        },

        totalAmount: total,

        status: "payment_pending"
    });

    req.session.orderId = order._id;

    req.session.save((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Session save failed");
        }

        res.redirect("/payment");
    });

};