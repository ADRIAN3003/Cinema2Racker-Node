const Uzenet = require("../models/Uzenet");

exports.index = async (req, res, next) => {
    try {
        const uzenetek = await Uzenet.find().sort({ createdAt: -1 }).lean();
        res.render("uzenetek", { title: "Üzenetek", uzenetek });
    } catch (err) {
        next(err);
    }
};
