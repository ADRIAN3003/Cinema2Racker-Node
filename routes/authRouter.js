const router = require("express").Router();
const controller = require("../controllers/authController");

const guestOnly = (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/");
    }
    next();
};

router.get("/register", guestOnly, controller.registerGet);
router.post("/register", guestOnly, controller.registerPost);
router.get("/login", guestOnly, controller.loginGet);
router.post("/login", guestOnly, controller.loginPost);
router.get("/logout", controller.logout);

module.exports = router;
