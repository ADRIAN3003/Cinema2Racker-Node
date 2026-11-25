const Film = require("../models/Film");
const Mozi = require("../models/Mozi");
const Vetites = require("../models/Vetites");

exports.index = async (req, res, next) => {
    try {
        const [filmek, mozik, vetitesek] = await Promise.all([
            Film.find().sort({ cim: 1 }).collation({ locale: "hu" }).lean(),
            Mozi.find().sort({ nev: 1 }).collation({ locale: "hu" }).lean(),
            Vetites.find().populate("film", "cim mufaj").populate("mozi", "nev iranyitoszam").lean()
        ]);

        const musor = vetitesek
            .filter((v) => v.film && v.mozi)
            .sort((a, b) => a.film.cim.localeCompare(b.film.cim, "hu") || a.mozi.nev.localeCompare(b.mozi.nev, "hu"));

        res.render("adatbazis", { title: "Adatbázis", filmek, mozik, musor });
    } catch (err) {
        next(err);
    }
};
