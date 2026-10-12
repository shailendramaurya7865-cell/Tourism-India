// =========================================================
// API HELPER
// =========================================================


async function apiGet(endpoint) {

    const url =
        `${API_CONFIG.BASE_URL}${endpoint}`;

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            `API request failed: ${response.status}`
        );

    }

    return await response.json();
}
