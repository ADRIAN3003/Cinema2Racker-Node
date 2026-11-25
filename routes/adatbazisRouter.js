const router = require("express").Router();
const controller = require("../controllers/adatbazisController");

router.get("/adatbazis", controller.index);

module.exports = router;
