/*
 * Tourism India — States Page
 *
 * API:
 * GET http://localhost:8080/api/states
 */

const API_BASE_URL = "http://localhost:8080/api";

// Keep all states here after fetching them from the backend.
let allStates = [];


/* =========================================================
   API
========================================================= */

async function fetchStates() {
    const response = await fetch(`${API_BASE_URL}/states`);
    console.log(response)

    if (!response.ok) {
        throw new Error(`Failed to load states: HTTP ${response.status}`);
    }

    const result = await response.json();

    // Supports your standard ApiResponse:
    // { success: true, message: "...", data: [...] }
    if (result.success === false) {
        throw new Error(result.message || "Unable to load states.");
    }

    const states = result.data ?? result;

    if (!Array.isArray(states)) {
        throw new Error("The states API did not return a list.");
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
   RENDER STATES
========================================================= */

function renderStates(states) {
    const grid = document.getElementById("statesGrid");
    const message = document.getElementById("statesMessage");
    const count = document.getElementById("stateCount");

    if (!grid || !message || !count) {
        return;
    }

    // Update the number of visible states.
    count.textContent = `${states.length} ${states.length === 1 ? "state" : "states"
        }`;

    // Handle empty results.
    if (states.length === 0) {
        grid.innerHTML = "";
        message.textContent = "No states found. Try another search.";
        message.className = "states-message";
        return;
    }

    message.textContent = "";
    message.className = "states-message";

    // Generate one card for each state.
    grid.innerHTML = states.map((state, index) => `
        <a
            class="state-card"
            href="state.html?id=${encodeURIComponent(state.id)}"
            aria-label="Explore ${escapeHtml(state.name)}"
        >
            <div class="state-card-top">
                <span class="state-number" aria-hidden="true">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="state-arrow" aria-hidden="true">→</span>
            </div>

            <h3>${escapeHtml(state.name)}</h3>

            <p>Explore destinations and experiences</p>
        </a>
    `).join("");
}


/* =========================================================
   SEARCH / FILTER
========================================================= */

function setupStateSearch() {
    const input = document.getElementById("stateSearch");

    if (!input) {
        return;
    }

    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();

        const filteredStates = allStates.filter(state =>
            String(state.name ?? "")
                .toLowerCase()
                .includes(query)
        );
        renderStates(filteredStates);
    });
}


/* =========================================================
   INITIALIZE PAGE
========================================================= */

async function initializeStatesPage() {
    const grid = document.getElementById("statesGrid");
    const message = document.getElementById("statesMessage");
    const count = document.getElementById("stateCount");

    try {
        message.textContent = "Loading states...";
        count.textContent = "";
        allStates = await fetchStates();
        renderStates(allStates);
        setupStateSearch();

    } catch (error) {
        console.error("Error loading states:", error);

        grid.innerHTML = "";
        count.textContent = "";

        message.textContent =
            "Unable to load states. Please check your connection and try again.";
        message.className = "states-message error";
    }
}

function createSlug(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

document.addEventListener("DOMContentLoaded", initializeStatesPage);
