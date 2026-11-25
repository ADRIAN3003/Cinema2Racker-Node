document.querySelectorAll("[data-filter-table]").forEach((input) => {
    const table = document.querySelector(input.dataset.filterTable);
    const counter = document.querySelector(input.dataset.filterCount);
    const rows = Array.from(table.querySelectorAll("tbody tr"));

    input.addEventListener("input", () => {
        const needle = input.value.trim().toLocaleLowerCase("hu");
        let visible = 0;
        rows.forEach((row) => {
            const match = row.textContent.toLocaleLowerCase("hu").includes(needle);
            row.classList.toggle("d-none", !match);
            if (match) {
                visible += 1;
            }
        });
        if (counter) {
            counter.textContent = visible;
        }
    });
});
