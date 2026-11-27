const router = require("express").Router();
const { isLoggedIn } = require("../middleware/auth");
const controller = require("../controllers/uzenetekController");

router.get("/uzenetek", isLoggedIn, controller.index);

module.exports = router;
