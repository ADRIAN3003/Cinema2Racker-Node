document.addEventListener("DOMContentLoaded", async () => {
    Chart.defaults.color = "#adb5bd";
    Chart.defaults.borderColor = "rgba(255,255,255,0.1)";

    const paletta = [
        "#ffb703",
        "#fb8500",
        "#2a9d8f",
        "#219ebc",
        "#8ecae6",
        "#e76f51",
        "#9b5de5",
        "#f15bb5",
        "#06d6a0",
        "#adb5bd"
    ];

    const oszlopDiagram = (id, adatok, vizszintes) => {
        const ertekTengely = vizszintes ? "x" : "y";
        return new Chart(document.getElementById(id), {
            type: "bar",
            data: {
                labels: adatok.map((d) => d.nev),
                datasets: [{
                    label: "Darab",
                    data: adatok.map((d) => d.darab),
                    backgroundColor: "#ffb703"
                }]
            },
            options: {
                indexAxis: vizszintes ? "y" : "x",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    [ertekTengely]: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                }
            }
        });
    };

    const korDiagram = (id, tipus, adatok) => {
        return new Chart(document.getElementById(id), {
            type: tipus,
            data: {
                labels: adatok.map((d) => d.nev),
                datasets: [{
                    data: adatok.map((d) => d.darab),
                    backgroundColor: paletta
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom" }
                }
            }
        });
    };

    try {
        const valasz = await fetch("/diagram/adat");
        if (!valasz.ok) {
            throw new Error(`Hiba a diagram adatok lekérésekor (${valasz.status}).`);
        }
        const adat = await valasz.json();

        oszlopDiagram("mufajChart", adat.mufajok, false);
        oszlopDiagram("moziChart", adat.mozik, true);
        korDiagram("szinesChart", "doughnut", adat.szines);
        korDiagram("szinkronChart", "pie", adat.szinkron);
    } catch (err) {
        console.error("Nem sikerült betölteni a diagramokat:", err);
    }
});
