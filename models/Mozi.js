const mongoose = require("mongoose");

const moziSchema = new mongoose.Schema({
    nev: {
        type: String,
        required: [true, "A név megadása kötelező."],
        trim: true,
        maxlength: [120, "A név legfeljebb 120 karakter lehet."]
    },
    iranyitoszam: {
        type: String,
        trim: true,
        match: [/^\d{4}$/, "Az irányítószám 4 számjegy legyen."]
    },
    cim: { type: String, trim: true, maxlength: 150, default: "" },
    telefon: { type: String, trim: true, maxlength: 30, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Mozi", moziSchema, "mozik");
