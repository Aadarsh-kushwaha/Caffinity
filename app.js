// server.js
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const path = require("path");
const ejsMate = require("ejs-mate");
const Product = require("./models/product");
const Cart = require("./models/cart");
const Drink = require("./models/drink");
const { contactValidation } = require("./middleware/validateContact");
const validateContact = require("./middleware/validateContact");
const passport = require('passport');
require('./auth');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();
const Query = require("./models/query");
const cart = require("./models/cart");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("./passportConfig");
const bcrypt = require("bcrypt");
const Order = require("./models/order");

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Login required" });
  }
  next();
}


// ====== MongoDB Connection ======
const dburl = "mongodb://127.0.0.1:27017/coffee-shop";



// Connect to MongoDB
async function main() {
    await mongoose.connect(dburl);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("there is some error", err); 
  });
  

// ====== View Engine Setup ======

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ====== Middlewares ======
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// 1️⃣ Public folder for CSS, JS, etc.
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));


// 2️⃣ Init folder for images or other assets
app.use(express.static(path.join(__dirname, "Init")));


// ====== Session Config ======
const store = MongoStore.create({
  mongoUrl: dburl,
  touchAfter: 24 * 60 * 60, // reduce session updates
});


app.use(cookieParser());
app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
     cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days
      maxAge: 1000 * 60 * 60 * 24 * 3,
    },
}));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);   // session me sirf id save hogi
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);     // req.user me full user aayega
  } catch (err) {
    done(err, null);
  }
});



// ====== Locals Middleware ======

app.get('/auth/google',
  passport.authenticate('google',{scope: ['email','profile']})
);
app.get('/google/callback',
  passport.authenticate('google',{
    // successRedirect : '/protected',
    failureRedirect: '/auth/failure',

  }),
  (req, res) => {

    // 👇 YAHAN FLASH LAGANA HAI
    req.flash("success", `Welcome ${req.user.name}! 🚀`);

    res.redirect("/");
  }
);


app.get('/auth/failure',(req,res)=>{
  res.send("SOMETHING WENT WRONG...");
});


app.post("/signup", async (req, res, next) => {
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

            req.flash("success", "Welcome to Caffinity!");
            res.redirect("/home");
        });

    } catch (err) {
        res.send("Error: " + err.message);
    }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.session.destroy(err => {
      if (err) return next(err);

      res.clearCookie('connect.sid', { path: '/' }); // ensure path matches session cookie
      res.redirect('/home');  // **sirf yahi response bhejo**
    });
  });
});



app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ====== Routes ======

app.get('/protected',isLoggedIn,(req,res)=>{
 res.send("User: " + req.user.name);
});

app.get('/check', (req, res) => {
  if (req.user) {
    res.send("User is logged in: " + req.user.email);
  } else {
    res.send("User is NOT logged in");
  }
});

app.get("/home", (req, res) => {
    res.render("coffees/index");
});

app.get("/about", (req, res) => {
    res.render("coffees/about");
});





app.get("/menu", async (req, res) => {
    const coffees = await Product.find({ category: "coffee" });
    const drinks = await Product.find({ category: "drink" });

    res.render("coffees/menu", { coffees, drinks });
});


app.get("/pages", (req, res) => {
  res.send("This page is not available yet"); // views/menu.ejs
});
app.get("/connect", (req, res) => {
    res.render("coffees/contact");
});


app.get("/user", (req, res) => {
   res.render("users/login");
});


app.get("/signup", (req, res) => {
   res.render("users/signup");
});


// GET route
app.get("/contact", (req, res) => {
  res.render("coffees/contact");
});

// POST route
app.post("/contact", validateContact, async(req, res) => {
 try{
  const {name,email,mobile,issue , source , message } = req.body;
  const newQuery = new Query({
    name,
    email,
    mobile,
    issue,
    source,
    message,
  });
 
 await newQuery.save();
 
req.flash("success", "Your response is recorded");

return res.redirect("/contact");

 }catch(err){
  res.send("Error:" + err.message);
 }
});

app.get("/product/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
   // res.send(coffee.name);
   //res.send(`Your clicked button named as ${coffee.name} and cost is : ${coffee.price} `);
  res.render("coffees/show",{product});
});

app.post("/pushCart", isLoggedIn, async (req, res) => {
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
    console.log("ERROR 🔥:", err);
    res.send("Error ❌");
  }
});

app.get("/cart", isLoggedIn, async (req, res) => {
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

    console.log("locals success:", res.locals.success);

    res.render("cart/cart", {
      cart
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading cart");
  }
});

app.delete("/cart/:productId", isLoggedIn, async (req, res) => {
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
});
app.put("/cart/increase/:productId", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  await Cart.updateOne(
    { userId, "items.productId": productId },
    {
      $inc: { "items.$.quantity": 1 }
    }
  );

  req.flash("success", "Quantity Increased");

  return res.redirect("/cart");
});




app.put("/cart/decrease/:productId", isLoggedIn, async (req, res) => {
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
});


app.get("/checkout",isLoggedIn, async (req, res) => {
  console.log("GET ROUTE");
console.log(req.user);
const cart = await Cart.findOne({
   userId: req.user._id
 
}).populate("items.productId");

console.log("Cart:", cart);
if (!cart || cart.items.length === 0) {
  return res.redirect("/cart");
}

let total = 0;

cart.items.forEach(item => {
  total += item.productId.price * item.quantity;
});

    res.render("cart/checkout", { cart, total });
});

app.post("/checkout",isLoggedIn, async (req, res) => {
  console.log(req.user);

    const cart = await Cart.findOne({
        userId: req.user._id
    }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
        return res.redirect("/cart");
    }

    let total = 0;
    const orderItems = [];

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

    // 🔥 CUSTOMER DATA FROM FORM (NOT USER PROFILE)
    const customerData = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        tableNumber: req.body.tableNumber,
        instructions: req.body.instructions
    };

    const order = await Order.create({

        userId: req.user._id,   // login reference

        items: orderItems,

        customer: customerData, // billing info

        totalAmount: total,

        status: "payment_pending"
    });

    req.session.orderId = order._id;

    res.redirect("/payment");

});

app.get("/payment",isLoggedIn, async (req, res) => {

    const order = await Order.findById(req.session.orderId);

    if (!order) return res.redirect("/cart");

    res.render("payment", { order });
});


app.get("/err",(req ,res,) =>{
  abcd=abcd;
});


app.use((err, req, res, next) => {
 console.log(err);
 next();
});





// ====== Start Server ======
const PORT = 8080;
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running");
});

