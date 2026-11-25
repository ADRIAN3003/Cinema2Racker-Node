const mongoose = require("mongoose");

const filmSchema = new mongoose.Schema({
    cim: {
        type: String,
        required: [true, "A cím megadása kötelező."],
        trim: true,
        minlength: [2, "A cím legalább 2 karakter legyen."],
        maxlength: [150, "A cím legfeljebb 150 karakter lehet."]
    },
    szines: { type: Boolean, default: true },
    szinkron: {
        type: String,
        enum: { values: ["", "fel", "mb", "szöveg nélküli"], message: "Érvénytelen szinkron érték." },
        default: ""
    },
    szarmazas: {
        type: String,
        trim: true,
        maxlength: [120, "A származás legfeljebb 120 karakter lehet."],
        default: ""
    },
    mufaj: {
        type: String,
        trim: true,
        maxlength: [50, "A műfaj legfeljebb 50 karakter lehet."],
        default: ""
    },
    hossz: {
        type: Number,
        required: [true, "A hossz megadása kötelező."],
        min: [1, "A hossz legalább 1 perc legyen."],
        max: [600, "A hossz legfeljebb 600 perc lehet."]
    }
}, { timestamps: true });

module.exports = mongoose.model("Film", filmSchema, "films");
