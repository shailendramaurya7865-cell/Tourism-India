/*
 * Tourism India — Home Page
 *
 * API base:
 *     http://localhost:8080/api
 *
 * The code is intentionally separated from the HTML so the
 * page can be scaled later without rewriting the UI.
 */

const API_BASE_URL = "http://localhost:8080/api";


/* =========================================================
   FALLBACK DATA
   Used when the backend is unavailable or an endpoint is
   not implemented yet.
========================================================= */

const FALLBACK_DESTINATIONS = [
    {
        id: 1,
        name: "Jaipur",
        stateName: "Rajasthan",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 2,
        name: "Goa",
        stateName: "Goa",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 3,
        name: "Manali",
        stateName: "Himachal Pradesh",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=85"
    }
];

const FALLBACK_CATEGORIES = [
    { name: "Historical", icon: "🏛️" },
    { name: "Religious", icon: "🛕" },
    { name: "Beaches", icon: "🏖️" },
    { name: "Wildlife", icon: "🐅" },
    { name: "Mountains", icon: "🏔️" },
    { name: "Adventure", icon: "🥾" },
    { name: "Museums", icon: "🏛️" },
    { name: "Waterfalls", icon: "💧" },
    { name: "Lakes", icon: "🌊" },
    { name: "Culture", icon: "🎭" }
];

const FALLBACK_SEARCH_DATA = [
    { name: "Himachal Pradesh", type: "State" },
    { name: "Manali", type: "City" },
    { name: "Jaipur", type: "City" },
    { name: "Goa", type: "State" },
    { name: "Taj Mahal", type: "Tourist Place" },
    { name: "Hidimba Devi Temple", type: "Tourist Place" }
];


/* =========================================================
   HELPERS
========================================================= */

async function getJson(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();

        // Your backend wraps responses in:
        // { success, message, data }
        return json?.data ?? json;
    } catch (error) {
        console.warn(`API request failed: ${endpoint}`, error);
        return null;
    }
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function normalizeImage(image, fallback) {
    return image || fallback;
}


/* =========================================================
   POPULAR DESTINATIONS
========================================================= */

function renderDestinations(destinations) {
    const container = document.getElementById("popularDestinations");

    if (!container) {
        return;
    }

    container.innerHTML = destinations.map(place => `
        <a class="destination-card"
           href="place.html?id=${encodeURIComponent(place.id ?? "")}">

            <div class="destination-image-wrap">
                <img
                    class="destination-image"
                    src="${normalizeImage(place.image, FALLBACK_DESTINATIONS[0].image)}"
                    alt="${escapeHtml(place.name)}"
                    loading="lazy"
                >
            </div>

            <div class="destination-content">
                <h3>${escapeHtml(place.name)}</h3>

                <p class="destination-state">
                    ${escapeHtml(place.stateName || place.state || "India")}
                </p>

                <div class="rating">
                    <span class="rating-star">★</span>
                    <span>${place.rating ?? "4.7"}</span>
                </div>
            </div>

        </a>
    `).join("");
}


/* =========================================================
   CATEGORIES
========================================================= */

function renderCategories(categories) {
    const container = document.getElementById("categoryGrid");

    if (!container) {
        return;
    }

    container.innerHTML = categories.map((category, index) => {
        const fallback = FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length];

        const name =
            typeof category === "string"
                ? category
                : category.name || category.title || fallback.name;

        const icon =
            typeof category === "object" && category.icon
                ? category.icon
                : fallback.icon;

        return `
            <a href="#" class="category-card">
                <span class="category-icon">${escapeHtml(icon)}</span>
                <span>${escapeHtml(name)}</span>
            </a>
        `;
    }).join("");
}


/* =========================================================
   SEARCH
========================================================= */

let searchItems = [...FALLBACK_SEARCH_DATA];

function buildSearchItems(states, cities, places) {
    const items = [];

    (states || []).forEach(item => {
        items.push({
            id: item.id,
            name: item.name,
            type: "State",
            url: `state.html?id=${encodeURIComponent(item.id)}`
        });
    });

    (cities || []).forEach(item => {
        items.push({
            id: item.id,
            name: item.name,
            type: "City",
            url: `city.html?id=${encodeURIComponent(item.id)}`
        });
    });

    (places || []).forEach(item => {
        items.push({
            id: item.id,
            name: item.name,
            type: "Tourist Place",
            url: `place.html?id=${encodeURIComponent(item.id)}`
        });
    });

    return items.length ? items : [...FALLBACK_SEARCH_DATA];
}

function renderSearchResults(query) {
    const resultBox = document.getElementById("searchResults");

    if (!resultBox) {
        return;
    }

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        resultBox.classList.remove("active");
        resultBox.innerHTML = "";
        return;
    }

    const matches = searchItems
        .filter(item =>
            item.name.toLowerCase().includes(normalizedQuery) ||
            item.type.toLowerCase().includes(normalizedQuery)
        )
        .slice(0, 7);

    if (!matches.length) {
        resultBox.innerHTML = `
            <div class="search-result">
                <div class="search-result-icon">⌕</div>
                <div>
                    <strong>No destination found</strong>
                    <small>Try another state, city or place</small>
                </div>
            </div>
        `;

        resultBox.classList.add("active");
        return;
    }

    resultBox.innerHTML = matches.map(item => `
        <a
            class="search-result"
            href="${item.url || "#"}"
        >
            <span class="search-result-icon">
                ${item.type === "State" ? "⌖" : item.type === "City" ? "▦" : "●"}
            </span>

            <span>
                <strong>${escapeHtml(item.name)}</strong>
                <small>${escapeHtml(item.type)}</small>
            </span>
        </a>
    `).join("");

    resultBox.classList.add("active");
}

function setupSearch() {
    const input = document.getElementById("destinationSearch");
    const button = document.getElementById("searchButton");
    const resultBox = document.getElementById("searchResults");

    if (!input) {
        return;
    }

    input.addEventListener("input", () => {
        renderSearchResults(input.value);
    });

    input.addEventListener("focus", () => {
        if (input.value.trim()) {
            renderSearchResults(input.value);
        }
    });

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();

            const query = input.value.trim();

            if (!query) {
                return;
            }

            const match = searchItems.find(item =>
                item.name.toLowerCase() === query.toLowerCase()
            );

            if (match?.url) {
                window.location.href = match.url;
            }
        }

        if (event.key === "Escape") {
            resultBox.classList.remove("active");
        }
    });

    button?.addEventListener("click", () => {
        const query = input.value.trim();

        if (!query) {
            input.focus();
            return;
        }

        const match = searchItems.find(item =>
            item.name.toLowerCase() === query.toLowerCase()
        );

        if (match?.url) {
            window.location.href = match.url;
        } else {
            renderSearchResults(query);
        }
    });

    document.addEventListener("click", event => {
        if (!event.target.closest(".hero-search-wrapper")) {
            resultBox.classList.remove("active");
        }
    });
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {
    const button = document.getElementById("mobileMenuButton");
    const menu = document.getElementById("mobileNav");

    if (!button || !menu) {
        return;
    }

    button.addEventListener("click", () => {
        const active = menu.classList.toggle("active");

        button.setAttribute("aria-expanded", String(active));
        button.textContent = active ? "×" : "☰";
    });

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            button.setAttribute("aria-expanded", "false");
            button.textContent = "☰";
        });
    });
}


/* =========================================================
   LOAD BACKEND DATA
========================================================= */

async function loadHomeData() {

    // These requests match the Tourism India backend structure.
    //
    // Existing:
    //   GET /api/states
    //   GET /api/cities
    //   GET /api/tourist-places
    //   GET /api/categories
    //
    // Optional / future:
    //   GET /api/tourist-places/featured

    const [
        states,
        cities,
        touristPlaces,
        categories
    ] = await Promise.all([
        getJson("/states"),
        getJson("/cities"),
        getJson("/tourist-places"),
        getJson("/categories")
    ]);

    /*
     * Popular destinations.
     *
     * If your backend later provides:
     *     /api/tourist-places/featured
     *
     * you can replace this selection with that endpoint.
     */
    const places = Array.isArray(touristPlaces)
        ? touristPlaces
        : [];

    const popular = places.slice(0, 3);

    if (popular.length) {
        renderDestinations(
            popular.map((place, index) => ({
                id: place.id,
                name: place.name,
                stateName:
                    place.stateName ||
                    place.state?.name ||
                    place.city?.state?.name ||
                    "India",
                rating:
                    place.averageRating ||
                    place.rating ||
                    "4.7",
                image:
                    place.imageUrl ||
                    place.image ||
                    FALLBACK_DESTINATIONS[index % FALLBACK_DESTINATIONS.length].image
            }))
        );
    } else {
        renderDestinations(FALLBACK_DESTINATIONS);
    }

    if (Array.isArray(categories) && categories.length) {
        renderCategories(categories);
    } else {
        renderCategories(FALLBACK_CATEGORIES);
    }

    searchItems = buildSearchItems(
        Array.isArray(states) ? states : [],
        Array.isArray(cities) ? cities : [],
        Array.isArray(touristPlaces) ? touristPlaces : []
    );
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    setupSearch();
    setupMobileMenu();

    // Render immediately so the page never looks empty.
    renderDestinations(FALLBACK_DESTINATIONS);
    renderCategories(FALLBACK_CATEGORIES);

    // Then replace fallback content with API data.
    await loadHomeData();
});
