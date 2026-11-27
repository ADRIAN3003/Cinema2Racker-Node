const Film = require("../models/Film");
const Mozi = require("../models/Mozi");
const Vetites = require("../models/Vetites");

const szinkronNevek = {
    fel: "feliratos",
    mb: "magyarul beszélő",
    "szöveg nélküli": "szöveg nélküli",
    "": "nincs adat"
};

exports.index = async (req, res, next) => {
    try {
        const [filmek, mozik] = await Promise.all([
            Film.countDocuments(),
            Mozi.countDocuments()
        ]);
        res.render("diagram", { title: "Diagram", osszes: { filmek, mozik } });
    } catch (err) {
        next(err);
    }
};

exports.adat = async (req, res, next) => {
    try {
        const [mufajRaw, mozik, szinesRaw, szinkronRaw] = await Promise.all([
            Film.aggregate([
                { $group: { _id: { $cond: [{ $eq: ["$mufaj", ""] }, "ismeretlen", "$mufaj"] }, darab: { $sum: 1 } } },
                { $sort: { darab: -1, _id: 1 } }
            ]),
            Vetites.aggregate([
                { $group: { _id: "$mozi", darab: { $sum: 1 } } },
                { $sort: { darab: -1, _id: 1 } },
                { $limit: 10 },
                { $lookup: { from: "mozik", localField: "_id", foreignField: "_id", as: "mozi" } },
                { $unwind: "$mozi" },
                { $project: { _id: 0, nev: "$mozi.nev", darab: 1 } }
            ]),
            Film.aggregate([
                { $group: { _id: "$szines", darab: { $sum: 1 } } },
                { $sort: { darab: -1 } }
            ]),
            Film.aggregate([
                { $group: { _id: "$szinkron", darab: { $sum: 1 } } },
                { $sort: { darab: -1, _id: 1 } }
            ])
        ]);

        const mufajok = mufajRaw.map((d) => ({ nev: d._id, darab: d.darab }));
        const szines = szinesRaw.map((d) => ({ nev: d._id ? "színes" : "fekete-fehér", darab: d.darab }));
        const szinkron = szinkronRaw.map((d) => ({ nev: szinkronNevek[d._id] || "nincs adat", darab: d.darab }));

        res.json({ mufajok, mozik, szines, szinkron });
    } catch (err) {
        next(err);
    }
};
