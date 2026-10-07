async function get(url) {

    const fullUrl = `${API_BASE_URL}${url}`;

    console.log("====================================");
    console.log("[API] GET Request");
    console.log("[API] URL:", fullUrl);

    try {

        const response = await fetch(fullUrl);

        console.log("[API] Status:", response.status);
        console.log("[API] OK:", response.ok);

        if (!response.ok) {

            const errorText = await response.text();

            console.error("[API] Error Response:", errorText);

            throw new Error(
                `API request failed: ${response.status}`
            );
        }

        const result = await response.json();

        console.log("[API] Response:", result);

        if (result.success === false) {

            console.error(
                "[API] Backend Error:",
                result.message
            );

            throw new Error(
                result.message || "Request failed"
            );
        }

        console.log("[API] Data:", result.data);
        console.log("====================================");

        return result.data;

    } catch (error) {

        console.error("[API] Request Failed:", error);
        console.log("====================================");

        throw error;
    }
}


/* ================= CATEGORIES ================= */

async function getCategories() {

    console.log("[HOME API] Loading categories...");

    const data = await get("/categories");

    console.log(
        "[HOME API] Categories received:",
        data
    );

    return data;
}


/* ================= FEATURED PLACES ================= */

async function getFeaturedPlaces() {

    console.log(
        "[HOME API] Loading featured places..."
    );

    const data =
        await get("/tourist-places/featured");

    console.log(
        "[HOME API] Featured places received:",
        data
    );

    return data;
}


/* ================= TRENDING STORIES ================= */

async function getTrendingStories() {

    console.log(
        "[HOME API] Loading trending stories..."
    );

    const data =
        await get("/stories/trending");

    console.log(
        "[HOME API] Trending stories received:",
        data
    );

    return data;
}

async function getPlaceById(placeId) {

    console.log(
        "[PLACE API] Loading place:",
        placeId
    );

    const data =
        await get(`/tourist-places/${placeId}`);

    console.log(
        "[PLACE API] Place received:",
        data
    );

    return data;
}