const Film = require("../models/Film");

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
