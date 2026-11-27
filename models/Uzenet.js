const mongoose = require("mongoose");

const uzenetSchema = new mongoose.Schema({
    nev: {
        type: String,
        required: [true, "A név megadása kötelező."],
        trim: true,
        minlength: [2, "A név legalább 2 karakter legyen."],
        maxlength: [80, "A név legfeljebb 80 karakter lehet."]
    },
    email: {
        type: String,
        required: [true, "Az e-mail cím megadása kötelező."],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Érvénytelen e-mail formátum."]
    },
    targy: {
        type: String,
        required: [true, "A tárgy megadása kötelező."],
        trim: true,
        minlength: [3, "A tárgy legalább 3 karakter legyen."],
        maxlength: [120, "A tárgy legfeljebb 120 karakter lehet."]
    },
    uzenet: {
        type: String,
        required: [true, "Az üzenet megadása kötelező."],
        trim: true,
        minlength: [10, "Az üzenet legalább 10 karakter legyen."],
        maxlength: [2000, "Az üzenet legfeljebb 2000 karakter lehet."]
    },
    kuldo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("Uzenet", uzenetSchema, "uzenetek");
