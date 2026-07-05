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
const Razorpay = require("razorpay");
require("dotenv").config();
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/google");
const cartRoutes = require("./routes/cart");
const renderRoutes = require("./routes/render");

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "You need to login first");
    return res.redirect("/user");
  }
  next();
}


// ====== MongoDB Connection ======
 // const dburl = "mongodb://127.0.0.1:27017/coffee-shop";

 
const mongoURL = process.env.ATLASDB_URL ;



// Connect to MongoDB
async function main() {
    await mongoose.connect(mongoURL);
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
  mongoUrl: mongoURL,
  touchAfter: 24 * 60 * 60, // reduce session updates
});


app.use(cookieParser());
app.use(session({
    store: store,
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
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


app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ====== Locals Middleware ======

app.get("/", (req, res) => {
  res.redirect("/render/home");
});
app.use("/users", userRoutes);


app.get('/auth/google',
  passport.authenticate('google',{scope: ['email','profile']})
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
  }),
  (req, res) => {
    req.flash("success", `Welcome ${req.user.name}! 🚀`);
    res.redirect("/render/home");
  }
);

app.get('/auth/failure', (req, res) => {
  req.flash("error", "Google login failed. Please try again.");
  res.redirect("/render/home");
});

app.use("/render" , renderRoutes);
app.use("/cart", cartRoutes);




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


app.get("/payment", isLoggedIn, async (req, res) => {
  console.log("pass check env");
  console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
    const order = await Order.findById(req.session.orderId);

//    let razorpayOrder;

// if (!order.razorpayOrderId) {
//     razorpayOrder = await razorpay.orders.create({
//         amount: order.totalAmount * 100,
//         currency: "INR",
//         receipt: order._id.toString()
//     });
// }

return res.send("Razorpay Created");
});
// app.get("/payment",isLoggedIn, async (req, res) => {
//                              console.log("===== PAYMENT ROUTE HIT =====");
//                             console.log("User:", req.user?.email);
//                      console.log("Session Order ID:", req.session.orderId);

                      
                     
//                      const order = await Order.findById(
//                        req.session.orderId
//                       );
//                       console.log("Order:", order);
//                                                    if (!order) {
//                                  return res.status(404).send("Order not found");
//                                                       }
//       let razorpayOrder;
// if (!order.razorpayOrderId) {

//      razorpayOrder =
//     await razorpay.orders.create({
//         amount: order.totalAmount * 100,
//         currency: "INR",
//         receipt: order._id.toString()
//     });

//     order.razorpayOrderId =
//     razorpayOrder.id;

//     await order.save();
// }
 
//     res.render("cart/payment", {
//         order,
//         razorpayOrder,
//          razorpayKey: process.env.RAZORPAY_KEY_ID
//     });

// });



app.get("/err",(req ,res,) =>{
  abcd=abcd;
});


app.use((err, req, res, next) => {
 console.log(err);
 next();
});






const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});