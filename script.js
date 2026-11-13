const lunarSites = {
"Mare Tranquillitatis": {
coordinates: "8.5° N, 31.4° E",
terrain: "Relatively flat basaltic plain",
temperature: "Approx. -170°C to +120°C",
suitability: "High",
science: "Apollo 11 landing region; important lunar geology"
},

"Shackleton Crater": {
    coordinates: "89.9° S, 0.0° E",
    terrain: "Polar crater with permanently shadowed areas",
    temperature: "Extremely cold in shadowed regions",
    suitability: "High",
    science: "Important target for studying lunar polar resources"
},

"Tycho Crater": {
    coordinates: "43.3° S, 11.2° W",
    terrain: "Large impact crater with rugged surroundings",
    temperature: "Large temperature variation",
    suitability: "Medium",
    science: "Young impact crater with extensive ray system"
},

"Aristarchus Plateau": {
    coordinates: "23.7° N, 47.4° W",
    terrain: "Volcanic plateau with varied terrain",
    temperature: "Large temperature variation",
    suitability: "Medium",
    science: "Geologically diverse and scientifically valuable region"
}

};

/* =========================
SHOW SITE INFORMATION
========================= */

function showSite(siteName) {

const site = lunarSites[siteName];

if (!site) {
    return;
}

const panel = document.getElementById("site-info");

if (!panel) {
    alert(
        siteName +
        "\n\nCoordinates: " + site.coordinates +
        "\nTerrain: " + site.terrain +
        "\nTemperature: " + site.temperature +
        "\nSuitability: " + site.suitability +
        "\nScientific Value: " + site.science
    );

    return;
}

panel.innerHTML = `
    <h2>${siteName}</h2>

    <div class="site-details">

        <p>
            <strong>📍 Coordinates:</strong>
            ${site.coordinates}
        </p>

        <p>
            <strong>🏔️ Terrain:</strong>
            ${site.terrain}
        </p>

        <p>
            <strong>🌡️ Temperature:</strong>
            ${site.temperature}
        </p>

        <p>
            <strong>🚀 Landing Suitability:</strong>
            ${site.suitability}
        </p>

        <p>
            <strong>🔬 Scientific Value:</strong>
            ${site.science}
        </p>

    </div>
`;

panel.style.display = "block";

panel.scrollIntoView({
    behavior: "smooth",
    block: "center"
});

}

/* =========================
SEARCH
========================= */

function searchSite() {

const searchBox = document.getElementById("site-search");

if (!searchBox) {
    return;
}

const searchText = searchBox.value.trim().toLowerCase();

if (searchText === "") {
    alert("Please enter a lunar site name.");
    return;
}

const siteName = Object.keys(lunarSites).find(name =>
    name.toLowerCase().includes(searchText)
);

if (siteName) {
    showSite(siteName);
} else {
    alert(
        "No matching lunar site found.\n\n" +
        "Try:\n" +
        "• Mare Tranquillitatis\n" +
        "• Shackleton Crater\n" +
        "• Tycho Crater\n" +
        "• Aristarchus Plateau"
    );
}

}

/* =========================
ENTER KEY SEARCH
========================= */

document.addEventListener("DOMContentLoaded", function () {

const searchBox = document.getElementById("site-search");

if (searchBox) {
    searchBox.addEventListener("keypress", function (event) {

        if (event.key === "Enter") {
            searchSite();
        }

    });
}

});
