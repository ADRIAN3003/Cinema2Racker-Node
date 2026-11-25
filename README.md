# Cinema2Racker (Node.js)

Moziműsor adatbázis a Web-programozás II gyakorlati beadandóhoz. Szerver oldali webalkalmazás Node.js, Express és Mongoose (ODM) alapokon, MongoDB Atlas adatbázissal, Render.com tárhelyen.

Készítők: Medve Adrián (N0M2FB) és Czibulya Márk (P7VEQO).

## Technológiák

- Node.js 22 LTS, Express 5, EJS sablonok
- Mongoose (ODM) és MongoDB Atlas
- express-session és connect-mongo (munkamenet az adatbázisban), bcrypt (jelszó hash)
- Bootswatch Cyborg téma (Bootstrap 5), Chart.js

## Szerepkörök

| Szerepkör | Mit lát |
|-----------|---------|
| Látogató | Főoldal, Adatbázis, Kapcsolat, Bejelentkezés, Regisztráció |
| Regisztrált felhasználó | + Üzenetek, Diagram |
| Admin | + CRUD (filmek kezelése) |

## Helyi futtatás

1. Függőségek telepítése:

```bash
npm install
```

2. A `.env.example` másolása `.env` néven, és kitöltése (MongoDB Atlas kapcsolat, session titok, jelszavak a seedhez). A `.env` nem kerül fel a GitHubra.

3. Az adatbázis feltöltése a három kollekcióval (`films`, `mozik`, `vetitesek`) és a két alap felhasználóval (`admin`, `teszt`):

```bash
npm run seed
```

4. Indítás:

```bash
npm start
```

Fejlesztés közben a `npm run dev` (nodemon) újraindítja a szervert a fájlok módosításakor.

Az oldal a `http://localhost:3000` címen érhető el.

## Render.com

- Típus: Web Service, nyilvános GitHub tárolóból
- Build Command: `npm install`
- Start Command: `node app.js`
- Environment változók: `MONGO_URI`, `SESSION_SECRET`
- Állapotellenőrzés: `/health`

## Mappaszerkezet

```
app.js            belépési pont, munkamenet, útvonalak automatikus betöltése
config/           adatbázis-kapcsolat
controllers/      a kérések kezelése
middleware/       isLoggedIn és isAdmin védelem
models/           Mongoose modellek
routes/           útvonalak (a *Router.js fájlokat az app.js automatikusan betölti)
seed/             seed script és a kiinduló TSV adatok
views/            EJS sablonok
public/           CSS és kliens oldali JavaScript
```
