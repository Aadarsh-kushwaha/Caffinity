const Product = require("../models/product");

module.exports.home = (req, res) => {
    res.render("coffees/index");
};

module.exports.about = (req, res) => {
    res.render("coffees/about");
};

module.exports.menu = async (req, res) => {
    const coffees = await Product.find({ category: "coffee" });
    const drinks = await Product.find({ category: "drink" });

    res.render("coffees/menu", { coffees, drinks });
};

module.exports.contact = (req, res) => {
    res.render("coffees/contact");
};


module.exports.showProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    res.render("coffees/show", { product });
};



module.exports.login = (req, res) => {
    res.render("users/login");
};

module.exports.signup = (req, res) => {
    res.render("users/signup");
};