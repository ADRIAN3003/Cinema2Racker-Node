const mongoose = require("mongoose");

const vetitesSchema = new mongoose.Schema({
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film", required: true },
    mozi: { type: mongoose.Schema.Types.ObjectId, ref: "Mozi", required: true }
}, { timestamps: true });

vetitesSchema.index({ film: 1, mozi: 1 }, { unique: true });

module.exports = mongoose.model("Vetites", vetitesSchema, "vetitesek");
