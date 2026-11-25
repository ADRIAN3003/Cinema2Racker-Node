require("dotenv").config({ quiet: true });
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Film = require("../models/Film");
const Mozi = require("../models/Mozi");
const Vetites = require("../models/Vetites");
const User = require("../models/User");

const readTsv = (fileName) => {
    const text = fs.readFileSync(path.join(__dirname, "data", fileName), "utf8").replace(/^﻿/, "");
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
    const keys = lines.shift().split("\t");
    return lines.map((line) => {
        const cells = line.split("\t");
        const row = {};
        keys.forEach((key, index) => {
            row[key] = (cells[index] || "").trim();
        });
        return row;
    });
};

const upsertUser = async (username, password, role) => {
    const hash = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ username }, { username, password: hash, role }, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
};

const run = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("A MONGO_URI nincs megadva a .env fájlban.");
    }
    if (!process.env.ADMIN_PASSWORD || !process.env.USER_PASSWORD) {
        throw new Error("Az ADMIN_PASSWORD és a USER_PASSWORD nincs megadva a .env fájlban.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    await Promise.all([Film.deleteMany({}), Mozi.deleteMany({}), Vetites.deleteMany({})]);

    const filmRows = readTsv("films.tsv");
    const moziRows = readTsv("mozik.tsv");
    const vetitesRows = readTsv("film_mozi.tsv");

    const films = await Film.insertMany(filmRows.map((row) => ({
        cim: row.cim,
        szines: row.szines === "1",
        szinkron: row.szinkron,
        szarmazas: row.szarmazas,
        mufaj: row.mufaj,
        hossz: Number(row.hossz)
    })));
    const filmIds = {};
    filmRows.forEach((row, index) => {
        filmIds[row.id] = films[index]._id;
    });

    const mozik = await Mozi.insertMany(moziRows.map((row) => ({
        nev: row.nev,
        iranyitoszam: row.iranyitoszam,
        cim: row.cim,
        telefon: row.telefon
    })));
    const moziIds = {};
    moziRows.forEach((row, index) => {
        moziIds[row.id] = mozik[index]._id;
    });

    const vetitesek = await Vetites.insertMany(vetitesRows.map((row) => ({
        film: filmIds[row.film_id],
        mozi: moziIds[row.mozi_id]
    })));

    await upsertUser("admin", process.env.ADMIN_PASSWORD, "admin");
    await upsertUser("teszt", process.env.USER_PASSWORD, "user");

    console.log(`Filmek: ${films.length}, mozik: ${mozik.length}, vetítések: ${vetitesek.length}`);
    console.log("Felhasználók: admin (admin), teszt (user)");
};

run()
    .catch((err) => {
        console.error("Seed hiba:", err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
