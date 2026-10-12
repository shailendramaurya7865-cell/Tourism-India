/*
 * =========================================================
 * TOURISM INDIA — STATE DETAIL PAGE
 *
 * API:
 * GET /api/states/{stateId}
 *
 * Example:
 * state-detail.html?id=3
 * =========================================================
 */

const DEFAULT_STATE_DESCRIPTION =
    "Discover the unique charm of this beautiful Indian state, " +
    "where rich traditions meet breathtaking landscapes. From " +
    "historic landmarks and vibrant cities to local cuisine and " +
    "natural wonders, every destination offers something special. " +
    "Explore its culture, heritage and memorable travel experiences.";

const DEFAULT_CATEGORIES = [
    { id: 1, name: "Historical Places" },
    { id: 2, name: "Temples & Spirituality" },
    { id: 3, name: "Nature & Wildlife" },
    { id: 4, name: "Mountains & Hills" },
    { id: 5, name: "Adventure" },
    { id: 6, name: "Food & Culture" },
    { id: 7, name: "Museums & Art" },
    { id: 8, name: "Beaches & Lakes" }
];

document.addEventListener("DOMContentLoaded", () => {
    loadStateDetail();
});


/* =========================================================
   LOAD STATE DETAIL
========================================================= */

async function loadStateDetail() {
    try {
        const stateId = getStateId();

        if (!stateId) {
            showError("State was not specified in the URL.");
            return;
        }

        const response = await apiGet(`/states/${stateId}`);

        if (!response || response.success === false) {
            showError(
                response?.message || "Unable to load state information."
            );
            return;
        }

        const data = response.data;

        if (!data || !data.state) {
            showError("State information was not found.");
            return;
        }

        renderState(data, stateId);

    } catch (error) {
        console.error("State detail error:", error);

        showError(
            "Unable to load state information. Please try again."
        );
    }
}


/* =========================================================
   GET STATE ID FROM URL
========================================================= */

function getStateId() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // Accept only positive integer IDs.
    if (!id || !/^[1-9]\d*$/.test(id)) {
        return null;
    }

    return id;
}


/* =========================================================
   RENDER STATE
========================================================= */

function renderState(data, stateId) {
    const state = data.state;
    const stateName = state.name || "Indian State";

    // State heading and breadcrumb.
    setText("stateName", stateName);
    setText("breadcrumbState", stateName);
    setText("stateSubtitle", state.tagline ||
        `Explore the cities, attractions and experiences of ${stateName}.`);

    // About section.
    setText("aboutTitle", `About ${stateName}`);

    setText(
        "stateDescription",
        getStateDescription(state)
    );

    // Hero image.
    setHeroImage(state);

    // Popular cities.
    renderCities(
        Array.isArray(data.popularCities) ? data.popularCities : [],
        state,
        stateId
    );

    // Tourist places.
    renderTouristPlaces(
        Array.isArray(data.touristPlaces) ? data.touristPlaces : [],
        stateId
    );

    // Categories can come from the state API or its tourist places.
    const categories = getStateCategories(data);

    renderCategories(categories, stateName);

    // Map preview.
    renderMapPreview(state, data);

    // Browser title.
    document.title = `${stateName} | Tourism India`;
}


/* =========================================================
   STATE DESCRIPTION
========================================================= */

function getStateDescription(state) {
    return (
        state.description ||
        state.about ||
        state.overview ||
        state.shortDescription ||
        DEFAULT_STATE_DESCRIPTION
    );
}


/* =========================================================
   HERO IMAGE
========================================================= */

function setHeroImage(state) {
    const hero = document.getElementById("stateHero");

    if (!hero) {
        return;
    }

    const imageUrl = getImageUrl(state);

    if (!imageUrl) {
        // CSS will use ../images/state-default.jpg.
        return;
    }

    hero.style.backgroundImage = `
        linear-gradient(
            90deg,
            rgba(8, 29, 46, 0.90) 0%,
            rgba(8, 29, 46, 0.64) 50%,
            rgba(8, 29, 46, 0.16) 100%
        ),
        url("${imageUrl.replace(/["\\\n\r]/g, "")}")
    `;
}


/*
 * Temporary image-field support.
 * Adjust these names when your API's image fields are finalized.
 */

function getImageUrl(item) {
    if (!item) {
        return "";
    }

    const image =
        item.imageUrl ||
        item.image ||
        item.coverImageUrl ||
        item.thumbnailUrl ||
        "";

    if (typeof image !== "string") {
        return "";
    }

    const url = image.trim();

    // Permit web images and relative image paths.
    // Reject unsafe schemes.
    if (
        /^https?:\/\//i.test(url) ||
        /^\/(?!\/)/.test(url) ||
        /^images\//i.test(url)
    ) {
        return url;
    }

    return "";
}


/* =========================================================
   POPULAR CITIES
========================================================= */

function renderCities(cities, state, stateId) {
    const grid = document.getElementById("citiesGrid");
    const viewAll = document.getElementById("viewAllCities");

    if (!grid) {
        return;
    }

    if (viewAll) {
        viewAll.href =
            `/pages/cities.html?stateId=${encodeURIComponent(stateId)}`;
    }

    if (!cities.length) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>
                    No popular cities are available for
                    ${escapeHtml(state.name)} yet.
                </p>
            </div>
        `;
        return;
    }

    grid.innerHTML = cities.map((city, index) => {
        const cityImage = getImageUrl(city);

        const imageStyle = cityImage
            ? `--city-image: url("${escapeHtml(cityImage)}")`
            : `--city-image: linear-gradient(
                    135deg,
                    ${getCityGradient(index)}
                )`;

        return `
            <a
                href="/pages/city.html?id=${encodeURIComponent(city.id)}"
                class="city-card"
                style="${imageStyle}"
                aria-label="Explore ${escapeHtml(city.name)}"
            >
                <div class="city-card-content">
                    <span class="city-card-label">
                        ${escapeHtml(state.name)}
                    </span>

                    <h3>${escapeHtml(city.name)}</h3>
                </div>
            </a>
        `;
    }).join("");
}


function getCityGradient(index) {
    const gradients = [
        "#167d7f, #102a43",
        "#c17b43, #713f27",
        "#607d55, #193c38",
        "#627c9b, #24364c",
        "#bb8557, #5b3b35"
    ];

    return gradients[index % gradients.length];
}


/* =========================================================
   TOP TOURIST PLACES
========================================================= */

function renderTouristPlaces(places, stateId) {
    const grid = document.getElementById("placesGrid");
    const viewAll = document.getElementById("viewAllPlaces");

    if (!grid) {
        return;
    }

    if (viewAll) {
        viewAll.href =
            `/pages/places.html?stateId=${encodeURIComponent(stateId)}`;
    }

    if (!places.length) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>No tourist places are available yet.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = places.map(place => {
        const cityName = place.city?.name || "";

        const description =
            place.shortDescription ||
            place.description ||
            "Discover this remarkable destination and its unique experiences.";

        const imageUrl = getImageUrl(place);

        const imageStyle = imageUrl
            ? `style="background-image: url('${escapeHtml(imageUrl)}')"`
            : "";

        const categories = Array.isArray(place.categories)
            ? place.categories
            : [];

        const categoryHtml = categories.length
            ? `
                <div class="place-categories">
                    ${categories.map(category => `
                        <span class="place-category">
                            ${escapeHtml(
                                typeof category === "string"
                                    ? category
                                    : category.name
                            )}
                        </span>
                    `).join("")}
                </div>
            `
            : "";

        return `
            <article
                class="place-card"
                data-place-id="${escapeHtml(place.id)}"
            >
                <div
                    class="place-card-image"
                    ${imageStyle}
                    role="img"
                    aria-label="${escapeHtml(place.name)}"
                ></div>

                <div class="place-card-body">
                    ${cityName ? `
                        <span class="place-card-city">
                            ${escapeHtml(cityName)}
                        </span>
                    ` : ""}

                    <h3>${escapeHtml(place.name)}</h3>

                    <p>${escapeHtml(description)}</p>

                    ${categoryHtml}
                </div>
            </article>
        `;
    }).join("");
}


/* =========================================================
   GET CATEGORIES
========================================================= */

function getStateCategories(data) {
    // Prefer categories directly returned by the state API.
    if (Array.isArray(data.categories) && data.categories.length) {
        return data.categories;
    }

    // Otherwise, derive unique categories from tourist places.
    const places = Array.isArray(data.touristPlaces)
        ? data.touristPlaces
        : [];

    const categoryMap = new Map();

    places.forEach(place => {
        if (!Array.isArray(place.categories)) {
            return;
        }

        place.categories.forEach(category => {
            const name = typeof category === "string"
                ? category
                : category?.name;

            if (name) {
                categoryMap.set(name.toLowerCase(), {
                    name: name
                });
            }
        });
    });

    if (categoryMap.size) {
        return Array.from(categoryMap.values());
    }

    // Temporary categories until the API supplies them.
    return DEFAULT_CATEGORIES;
}


/* =========================================================
   RENDER CATEGORIES
========================================================= */

function renderCategories(categories, stateName) {
    const grid = document.getElementById("categoriesGrid");
    const title = document.getElementById("categoriesTitle");

    if (!grid) {
        return;
    }

    if (title) {
        title.textContent = `Explore ${stateName} by Categories`;
    }

    grid.innerHTML = categories.map(category => {
        const categoryName = typeof category === "string"
            ? category
            : category.name;

        return `
            <article class="category-card">
                <div class="category-icon" aria-hidden="true">
                    ${getCategoryIcon(categoryName)}
                </div>

                <h3>${escapeHtml(categoryName)}</h3>
            </article>
        `;
    }).join("");
}


/* =========================================================
   CATEGORY ICON
========================================================= */

function getCategoryIcon(categoryName) {
    const name = String(categoryName || "").toLowerCase();

    if (name.includes("beach") || name.includes("lake")) {
        return "🌊";
    }

    if (
        name.includes("histor") ||
        name.includes("heritage")
    ) {
        return "🏛️";
    }

    if (
        name.includes("temple") ||
        name.includes("spiritual")
    ) {
        return "🛕";
    }

    if (
        name.includes("nature") ||
        name.includes("forest")
    ) {
        return "🌿";
    }

    if (name.includes("wildlife")) {
        return "🐘";
    }

    if (
        name.includes("mountain") ||
        name.includes("hill")
    ) {
        return "⛰️";
    }

    if (name.includes("adventure")) {
        return "🧗";
    }

    if (
        name.includes("museum") ||
        name.includes("art")
    ) {
        return "🏺";
    }

    if (
        name.includes("food") ||
        name.includes("cuisine")
    ) {
        return "🍛";
    }

    if (name.includes("culture")) {
        return "🎭";
    }

    return "✦";
}


/* =========================================================
   MAP PREVIEW
========================================================= */

function renderMapPreview(state, data) {
    const stateName = state.name || "India";

    setText("mapStateName", stateName);
    setText("mapPreviewTitle", stateName);

    const cities = Array.isArray(data.popularCities)
        ? data.popularCities
        : [];

    const places = Array.isArray(data.touristPlaces)
        ? data.touristPlaces
        : [];

    setText(
        "mapCityOne",
        cities[0]?.name || "Popular City"
    );

    setText(
        "mapCityTwo",
        places[0]?.name || cities[1]?.name || "Tourist Destination"
    );
}


/* =========================================================
   SET TEXT SAFELY
========================================================= */

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "";
    }
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {
    const main = document.querySelector("main");

    if (!main) {
        return;
    }

    main.innerHTML = `
        <section class="state-error-section">
            <div class="container">
                <div class="empty-state">
                    <h2>Something went wrong</h2>
                    <p>${escapeHtml(message)}</p>
                    <a href="/pages/states.html" class="view-all-link">
                        Browse States →
                    </a>
                </div>
            </div>
        </section>
    `;
}

