window.onload = async () => {

    await loadCategories();

    await loadFeaturedPlaces();

    await loadStories();

};


async function loadCategories() {

    const container =
        document.getElementById("categoriesContainer");

    try {

        const categories = await getCategories();

        if (!categories || categories.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    No categories available.
                </div>
            `;

            return;
        }

        container.innerHTML = categories.map(category => `

            <div
                class="category-card"
                onclick="openCategory(${category.id})">

                <h3>
                    ${escapeHtml(category.name)}
                </h3>

            </div>

        `).join("");

    } catch (error) {

        console.error(
            "Failed to load categories:",
            error
        );

        container.innerHTML = `
            <div class="error-state">
                Unable to load categories.
            </div>
        `;
    }
}


async function loadFeaturedPlaces() {

    const container =
        document.getElementById(
            "featuredPlacesContainer"
        );

    try {

        const places =
            await getFeaturedPlaces();

        if (!places || places.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    No featured destinations available.
                </div>
            `;

            return;
        }

        container.innerHTML = places.map(place => {

            const imageUrl =
                place.imageUrl ||
                "https://images.unsplash.com/photo-1500534623283-312aade485b7";

            return `

                <div
                    class="place-card"
                    onclick="openPlace(${place.id})">

                    <img
                        src="${imageUrl}"
                        alt="${escapeHtml(place.title)}"
                        loading="lazy">

                    <div class="place-content">

                        <h3 class="place-title">
                            ${escapeHtml(place.title)}
                        </h3>

                        <p class="place-city">
                            ${escapeHtml(place.city || "")},
                            ${escapeHtml(place.state || "")}
                        </p>

                        ${place.rating != null
                    ? `
                                    <p class="place-rating">
                                        ⭐ ${place.rating}
                                    </p>
                                  `
                    : ""
                }

                    </div>

                </div>

            `;

        }).join("");

    } catch (error) {

        console.error(
            "Failed to load featured places:",
            error
        );

        container.innerHTML = `
            <div class="error-state">
                Unable to load featured destinations.
            </div>
        `;
    }
}


async function loadStories() {

    const container =
        document.getElementById(
            "storiesContainer"
        );

    try {

        const stories =
            await getTrendingStories();

        if (!stories || stories.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    No trending stories available.
                </div>
            `;

            return;
        }

        container.innerHTML = stories.map(story => `

            <div
                class="story-card"
                onclick="openStory(${story.id})">

                <h3>
                    ${escapeHtml(story.title)}
                </h3>

                <p>
                    ${escapeHtml(
            story.description || ""
        )}
                </p>

            </div>

        `).join("");

    } catch (error) {

        console.error(
            "Failed to load stories:",
            error
        );

        container.innerHTML = `
            <div class="error-state">
                Unable to load stories.
            </div>
        `;
    }
}


function searchPlaces() {

    const keyword =
        document.getElementById(
            "searchInput"
        ).value.trim();

    if (!keyword) {
        return;
    }

    window.location.href =
        `places.html?search=${encodeURIComponent(keyword)}`;
}


function openCategory(categoryId) {

    window.location.href =
        `places.html?categoryId=${categoryId}`;
}


function openPlace(placeId) {

    window.location.href =
        `place.html?id=${placeId}`;
}


function openStory(storyId) {

    window.location.href =
        `story.html?id=${storyId}`;
}


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