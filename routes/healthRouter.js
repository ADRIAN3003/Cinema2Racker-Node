const router = require("express").Router();

router.get("/health", (req, res) => {
    res.type("text/plain").send("OK");
});

module.exports = router;
