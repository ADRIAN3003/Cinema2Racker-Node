require("dotenv").config({ quiet: true });
const fs = require("fs");
const path = require("path");
const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const connectDB = require("./config/db");

const app = express();

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: "sessions" }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.currentPath = req.path;
    res.locals.flash = req.session.flash || null;
    if (req.session.flash) {
        delete req.session.flash;
    }
    next();
});

const routesDir = path.join(__dirname, "routes");
fs.readdirSync(routesDir)
    .filter((file) => file.endsWith("Router.js"))
    .sort()
    .forEach((file) => app.use("/", require(path.join(routesDir, file))));

app.use((req, res) => {
    res.status(404).render("error", { title: "Nem található", code: 404, text: "Az oldal nem található." });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("error", { title: "Hiba", code: 500, text: "Váratlan hiba történt a szerveren." });
});

const port = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Szerver: http://localhost:${port}`);
    });
});
