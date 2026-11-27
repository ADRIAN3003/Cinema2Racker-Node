const router = require("express").Router();
const { isAdmin } = require("../middleware/auth");
const controller = require("../controllers/filmController");

router.get("/filmek", isAdmin, controller.index);
router.get("/filmek/uj", isAdmin, controller.ujForm);
router.post("/filmek", isAdmin, controller.letrehoz);
router.get("/filmek/:id/szerkesztes", isAdmin, controller.szerkesztForm);
router.post("/filmek/:id", isAdmin, controller.frissit);
router.post("/filmek/:id/torles", isAdmin, controller.torol);

module.exports = router;
