const mongoose = require("mongoose");
const Film = require("../models/Film");
const Vetites = require("../models/Vetites");

const urlapAdatok = (body) => {
    const b = body || {};
    const nyersHossz = String(b.hossz ?? "").trim();
    return {
        values: {
            cim: b.cim || "",
            mufaj: b.mufaj || "",
            szarmazas: b.szarmazas || "",
            hossz: b.hossz ?? "",
            szines: b.szines === "0" ? "0" : "1",
            szinkron: b.szinkron || ""
        },
        adat: {
            cim: b.cim || "",
            mufaj: b.mufaj || "",
            szarmazas: b.szarmazas || "",
            hossz: nyersHossz === "" ? undefined : Number(nyersHossz),
            szines: b.szines === "1",
            szinkron: b.szinkron || ""
        }
    };
};

const hibakKigyujtese = (err) => {
    const errors = {};
    for (const mezo of Object.keys(err.errors)) {
        errors[mezo] = err.errors[mezo].name === "CastError"
            ? "Érvénytelen érték."
            : err.errors[mezo].message;
    }
    return errors;
};

const nemTalalhato = (res) => {
    return res.status(404).render("error", {
        title: "Nem található",
        code: 404,
        text: "A film nem található."
    });
};

exports.index = async (req, res, next) => {
    try {
        const filmek = await Film.find().sort({ cim: 1 }).collation({ locale: "hu" }).lean();
        res.render("filmek/index", { title: "Filmek", filmek });
    } catch (err) {
        next(err);
    }
};

exports.ujForm = (req, res) => {
    res.render("filmek/form", {
        title: "Új film",
        cimsor: "Új film felvétele",
        action: "/filmek",
        gomb: "Mentés",
        values: { szines: "1", szinkron: "" },
        errors: {}
    });
};

exports.letrehoz = async (req, res, next) => {
    const { values, adat } = urlapAdatok(req.body);
    try {
        await Film.create(adat);
        req.session.flash = { type: "success", text: "A film felvétele megtörtént." };
        req.session.save(() => res.redirect("/filmek"));
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(422).render("filmek/form", {
                title: "Új film",
                cimsor: "Új film felvétele",
                action: "/filmek",
                gomb: "Mentés",
                values,
                errors: hibakKigyujtese(err)
            });
        }
        next(err);
    }
};

exports.szerkesztForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return nemTalalhato(res);
        }
        const film = await Film.findById(id).lean();
        if (!film) {
            return nemTalalhato(res);
        }
        res.render("filmek/form", {
            title: "Film szerkesztése",
            cimsor: "Film szerkesztése",
            action: `/filmek/${film._id}`,
            gomb: "Mentés",
            values: {
                cim: film.cim,
                mufaj: film.mufaj || "",
                szarmazas: film.szarmazas || "",
                hossz: film.hossz,
                szines: film.szines ? "1" : "0",
                szinkron: film.szinkron || ""
            },
            errors: {}
        });
    } catch (err) {
        next(err);
    }
};

exports.frissit = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return nemTalalhato(res);
    }
    const { values, adat } = urlapAdatok(req.body);
    try {
        const film = await Film.findById(id);
        if (!film) {
            return nemTalalhato(res);
        }
        film.cim = adat.cim;
        film.mufaj = adat.mufaj;
        film.szarmazas = adat.szarmazas;
        film.hossz = adat.hossz;
        film.szines = adat.szines;
        film.szinkron = adat.szinkron;

        await film.save();
        req.session.flash = { type: "success", text: "A film módosítása megtörtént." };
        req.session.save(() => res.redirect("/filmek"));
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(422).render("filmek/form", {
                title: "Film szerkesztése",
                cimsor: "Film szerkesztése",
                action: `/filmek/${id}`,
                gomb: "Mentés",
                values,
                errors: hibakKigyujtese(err)
            });
        }
        next(err);
    }
};

exports.torol = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return nemTalalhato(res);
        }
        const film = await Film.findByIdAndDelete(id);
        if (!film) {
            return nemTalalhato(res);
        }
        await Vetites.deleteMany({ film: id });
        req.session.flash = { type: "success", text: "A film törlése megtörtént." };
        req.session.save(() => res.redirect("/filmek"));
    } catch (err) {
        next(err);
    }
};
