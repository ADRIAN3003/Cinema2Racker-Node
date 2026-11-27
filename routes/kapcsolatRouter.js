const router = require("express").Router();
const controller = require("../controllers/kapcsolatController");

router.get("/kapcsolat", controller.index);
router.post("/kapcsolat", controller.kuldes);

module.exports = router;
