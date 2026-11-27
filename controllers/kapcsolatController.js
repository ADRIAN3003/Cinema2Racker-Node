const Uzenet = require("../models/Uzenet");

exports.index = (req, res) => {
    res.render("kapcsolat", { title: "Kapcsolat", errors: {}, values: {} });
};

exports.kuldes = async (req, res, next) => {
    const body = req.body || {};
    const values = {
        nev: body.nev || "",
        email: body.email || "",
        targy: body.targy || "",
        uzenet: body.uzenet || ""
    };

    try {
        const kuldo = req.session.user ? req.session.user.id : undefined;
        await Uzenet.create({
            nev: values.nev,
            email: values.email,
            targy: values.targy,
            uzenet: values.uzenet,
            kuldo
        });

        req.session.flash = { type: "success", text: "Köszönjük, az üzeneted megérkezett." };
        req.session.save(() => res.redirect("/kapcsolat"));
    } catch (err) {
        if (err.name === "ValidationError") {
            const errors = {};
            for (const mezo of Object.keys(err.errors)) {
                errors[mezo] = err.errors[mezo].message;
            }
            return res.status(422).render("kapcsolat", {
                title: "Kapcsolat",
                errors,
                values
            });
        }
        next(err);
    }
};
