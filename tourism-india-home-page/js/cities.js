/*
 * =========================================================
 * Tourism India — Cities Page
 *
 * API:
 * GET http://localhost:8080/api/cities
 * =========================================================
 */

const API_BASE_URL = "http://localhost:8080/api";


// Keep all cities here after fetching them.
let allCities = [];


// Keep all states here for the state filter.
let allStates = [];


/* =========================================================
   API — FETCH CITIES
========================================================= */

async function fetchCities() {

    const response = await fetch(`${API_BASE_URL}/cities`);

    console.log("Cities API response:", response);

    if (!response.ok) {
        throw new Error(
            `Failed to load cities: HTTP ${response.status}`
        );
    }

    const result = await response.json();

    console.log("Cities API data:", result);


    /*
     * Supports:
     *
     * {
     *   success: true,
     *   message: "...",
     *   data: [...]
     * }
     */

    if (result.success === false) {

        throw new Error(
            result.message || "Unable to load cities."
        );

    }


    const cities = result.data ?? result;


    if (!Array.isArray(cities)) {

        throw new Error(
            "The cities API did not return a list."
        );

    }


    return cities;
}


/* =========================================================
   API — FETCH STATES
========================================================= */

async function fetchStates() {

    const response = await fetch(
        `${API_BASE_URL}/states`
    );


    if (!response.ok) {

        throw new Error(
            `Failed to load states: HTTP ${response.status}`
        );

    }


    const result = await response.json();


    if (result.success === false) {

        throw new Error(
            result.message || "Unable to load states."
        );

    }


    const states = result.data ?? result;


    if (!Array.isArray(states)) {

        throw new Error(
            "The states API did not return a list."
        );

    }


    return states;
}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   CREATE SLUG
========================================================= */

function createSlug(value) {

    return String(value ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


/* =========================================================
   GET STATE NAME
========================================================= */

function getStateName(city) {

    /*
     * Supports different possible backend structures:
     *
     * city.state.name
     *
     * city.stateName
     *
     * city.state_name
     */

    if (city.state?.name) {
        return city.state.name;
    }

    if (city.stateName) {
        return city.stateName;
    }

    if (city.state_name) {
        return city.state_name;
    }

    return "";
}


/* =========================================================
   GET STATE ID
========================================================= */

function getStateId(city) {

    /*
     * Supports:
     *
     * city.state.id
     * city.stateId
     * city.state_id
     */

    if (city.state?.id) {
        return city.state.id;
    }

    if (city.stateId) {
        return city.stateId;
    }

    if (city.state_id) {
        return city.state_id;
    }

    return null;
}


/* =========================================================
   RENDER STATE FILTER
========================================================= */

function renderStateFilter() {

    const stateFilter =
        document.getElementById("stateFilter");


    if (!stateFilter) {
        return;
    }


    stateFilter.innerHTML = `
        <option value="all">
            All States
        </option>
    `;


    allStates.forEach(state => {

        const option =
            document.createElement("option");


        option.value = state.id;

        option.textContent = state.name;


        stateFilter.appendChild(option);

    });

}


/* =========================================================
   RENDER CITIES
========================================================= */

function renderCities(cities) {

    const grid =
        document.getElementById("citiesGrid");

    const message =
        document.getElementById("citiesMessage");

    const count =
        document.getElementById("cityCount");


    if (!grid || !message || !count) {
        return;
    }


    /*
     * Update city count
     */

    count.textContent =
        `${cities.length} ${
            cities.length === 1
                ? "city"
                : "cities"
        }`;


    /*
     * Handle empty results
     */

    if (cities.length === 0) {

        grid.innerHTML = "";

        message.textContent =
            "No cities found. Try another search.";

        message.className =
            "cities-message";

        return;

    }


    /*
     * Hide message
     */

    message.textContent = "";

    message.className =
        "cities-message";


    /*
     * Generate cards
     */

    grid.innerHTML = cities.map(
        (city, index) => {

            const stateName =
                getStateName(city);


            const stateId =
                getStateId(city);


            return `

                <a
                    class="city-card"
                    href="city-detail.html?id=${encodeURIComponent(city.id)}"
                    aria-label="Explore ${escapeHtml(city.name)}"
                >

                    <div class="city-card-top">

                        <span
                            class="city-number"
                            aria-hidden="true">

                            ${String(index + 1)
                                .padStart(2, "0")}

                        </span>


                        <span
                            class="city-arrow"
                            aria-hidden="true">

                            →

                        </span>

                    </div>


                    <div class="city-content">

                        <h3>
                            ${escapeHtml(city.name)}
                        </h3>


                        ${
                            stateName
                                ? `
                                    <p class="city-state">
                                        ${escapeHtml(stateName)}
                                    </p>
                                  `
                                : ""
                        }


                        <p class="city-description">
                            Explore destinations and experiences
                        </p>

                    </div>

                </a>

            `;

        }
    ).join("");

}


/* =========================================================
   SEARCH / FILTER
========================================================= */

function filterCities() {

    const searchInput =
        document.getElementById("citySearch");

    const stateFilter =
        document.getElementById("stateFilter");


    const query =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedState =
        stateFilter
            ? stateFilter.value
            : "all";


    const filteredCities =
        allCities.filter(city => {


            /*
             * Search by city name
             */

            const cityName =
                String(city.name ?? "")
                    .toLowerCase();


            /*
             * Search by state name too
             */

            const stateName =
                getStateName(city)
                    .toLowerCase();


            const matchesSearch =
                cityName.includes(query) ||
                stateName.includes(query);


            /*
             * State filter
             */

            const cityStateId =
                getStateId(city);


            const matchesState =
                selectedState === "all" ||
                String(cityStateId) ===
                String(selectedState);


            return (
                matchesSearch &&
                matchesState
            );

        });


    renderCities(filteredCities);

}


/* =========================================================
   SETUP SEARCH
========================================================= */

function setupCitySearch() {

    const input =
        document.getElementById("citySearch");


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        filterCities
    );

}


/* =========================================================
   SETUP STATE FILTER
========================================================= */

function setupStateFilter() {

    const stateFilter =
        document.getElementById("stateFilter");


    if (!stateFilter) {
        return;
    }


    stateFilter.addEventListener(
        "change",
        filterCities
    );

}


/* =========================================================
   INITIALIZE PAGE
========================================================= */

async function initializeCitiesPage() {

    const grid =
        document.getElementById("citiesGrid");

    const message =
        document.getElementById("citiesMessage");

    const count =
        document.getElementById("cityCount");


    try {

        message.textContent =
            "Loading cities...";


        count.textContent = "";


        /*
         * Fetch cities and states together.
         */

        const [
            cities,
            states
        ] = await Promise.all([
            fetchCities(),
            fetchStates()
        ]);


        allCities = cities;

        allStates = states;


        /*
         * Render state dropdown.
         */

        renderStateFilter();


        /*
         * Render cities.
         */

        renderCities(allCities);


        /*
         * Setup interactions.
         */

        setupCitySearch();

        setupStateFilter();


    } catch (error) {

        console.error(
            "Error loading cities:",
            error
        );


        if (grid) {
            grid.innerHTML = "";
        }


        if (count) {
            count.textContent = "";
        }


        if (message) {

            message.textContent =
                "Unable to load cities. Please check your connection and try again.";

            message.className =
                "cities-message error";

        }

    }

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeCitiesPage
);