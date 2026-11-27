const router = require("express").Router();
const { isLoggedIn } = require("../middleware/auth");
const controller = require("../controllers/diagramController");

router.get("/diagram", isLoggedIn, controller.index);
router.get("/diagram/adat", isLoggedIn, controller.adat);

module.exports = router;
