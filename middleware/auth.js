exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.session.flash = { type: "warning", text: "Az oldal megtekintéséhez be kell jelentkezned." };
    req.session.save(() => res.redirect("/login"));
};

exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    }
    req.session.flash = { type: "danger", text: "Ehhez az oldalhoz admin jogosultság kell." };
    req.session.save(() => res.redirect("/"));
};
