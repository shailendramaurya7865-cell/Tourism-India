async function getCategories() {

    const response =
            await fetch(
             `${CONFIG.BASE_URL}/categories`
            );

    return response.json();
}

async function getFeaturedPlaces() {

    const response =
        await fetch(
         `${CONFIG.BASE_URL}/tourist-places/featured`
        );

    return response.json();
}

async function getTrendingStories() {

    const response =
        await fetch(
        `${CONFIG.BASE_URL}/stories/trending`
        );

    return response.json();
}