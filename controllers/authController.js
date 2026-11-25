const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.registerGet = (req, res) => {
    res.render("register", { errors: {}, values: {} });
};

exports.registerPost = async (req, res, next) => {
    try {
        const username = (req.body.username || "").trim();
        const password = req.body.password || "";
        const passwordConfirm = req.body.passwordConfirm || "";
        const errors = {};

        if (username.length < 3 || username.length > 30) {
            errors.username = "A felhasználónév 3 és 30 karakter közötti legyen.";
        } else if (!/^[\p{L}0-9_.-]+$/u.test(username)) {
            errors.username = "Csak betű, szám, pont, kötőjel és aláhúzás használható.";
        }
        if (password.length < 6) {
            errors.password = "A jelszó legalább 6 karakter legyen.";
        }
        if (password !== passwordConfirm) {
            errors.passwordConfirm = "A két jelszó nem egyezik.";
        }
        if (!errors.username && await User.findOne({ username })) {
            errors.username = "Ez a felhasználónév már foglalt.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(422).render("register", { errors, values: { username } });
        }

        const hash = await bcrypt.hash(password, 10);
        await User.create({ username, password: hash, role: "user" });
        req.session.flash = { type: "success", text: "Sikeres regisztráció, most már bejelentkezhetsz." };
        req.session.save(() => res.redirect("/login"));
    } catch (err) {
        next(err);
    }
};

exports.loginGet = (req, res) => {
    res.render("login", { error: null, values: {} });
};

exports.loginPost = async (req, res, next) => {
    try {
        const username = (req.body.username || "").trim();
        const password = req.body.password || "";
        const user = await User.findOne({ username });
        const ok = user ? await bcrypt.compare(password, user.password) : false;

        if (!ok) {
            return res.status(401).render("login", { error: "Hibás felhasználónév vagy jelszó.", values: { username } });
        }

        req.session.user = { id: user._id, username: user.username, role: user.role };
        req.session.flash = { type: "success", text: `Üdvözlünk, ${user.username}!` };
        req.session.save(() => res.redirect("/"));
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};
