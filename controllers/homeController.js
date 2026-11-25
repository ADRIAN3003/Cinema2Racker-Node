const Film = require("../models/Film");
const Mozi = require("../models/Mozi");
const Vetites = require("../models/Vetites");

exports.index = async (req, res, next) => {
    try {
        const [filmDarab, moziDarab, vetitesDarab, mufajok] = await Promise.all([
            Film.countDocuments(),
            Mozi.countDocuments(),
            Vetites.countDocuments(),
            Film.aggregate([
                { $match: { mufaj: { $ne: "" } } },
                { $group: { _id: "$mufaj", darab: { $sum: 1 } } },
                { $sort: { darab: -1, _id: 1 } },
                { $limit: 10 }
            ])
        ]);

        res.render("home", {
            title: "Főoldal",
            css: ["/css/home.css"],
            statisztika: { filmDarab, moziDarab, vetitesDarab },
            mufajok
        });
    } catch (err) {
        next(err);
    }
};
