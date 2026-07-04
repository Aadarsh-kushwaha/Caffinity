module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
    req.flash("error", "You need to login first");
    return res.redirect("/render/login");
  }
  next();
}


module.exports.validateContact = (req, res, next)=> {
    const { error } = contactSchema.validate(req.body);

    if (error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }

    next();
};
