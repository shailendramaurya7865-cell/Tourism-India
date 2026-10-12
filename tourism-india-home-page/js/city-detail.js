/* =========================================================
   TOURISM INDIA — CITY DETAIL PAGE
   =========================================================

   API:
   GET /api/cities/{cityId}

   Expected response:

   {
       "success": true,
       "message": "Request successful",
       "data": {
           "id": 1,
           "name": "Agra",
           "image": null,
           "about": null,
           "state": {
               "id": 1,
               "name": "Uttar Pradesh"
           },
           "touristPlaces": [],
           "activities": [],
           "bestTimeToVisit": null,
           "location": null,
           "nearbyPlaces": []
       }
   }

========================================================= */


/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_CITY_IMAGE =
    "/images/default-city.jpg";


const DEFAULT_PLACE_IMAGE =
    "/images/default-place.jpg";


const DEFAULT_CITY_DESCRIPTION =
    "Discover the beauty, culture and experiences that make " +
    "this city special. Explore historic landmarks, local " +
    "traditions, beautiful surroundings and memorable places " +
    "that make this destination worth visiting.";


const DEFAULT_BEST_TIME =
    "The best time to visit this city depends on the " +
    "experiences you want to enjoy. Check the local weather " +
    "and seasonal conditions before planning your trip.";


const DEFAULT_LOCATION_DESCRIPTION =
    "Explore the location of this city and discover nearby " +
    "destinations, attractions and experiences.";


const DEFAULT_THINGS_TO_DO = [

    {
        name: "Sightseeing",
        icon: "◎"
    },

    {
        name: "Nature",
        icon: "♧"
    },

    {
        name: "Culture",
        icon: "♜"
    },

    {
        name: "Adventure",
        icon: "✦"
    }

];


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCityDetail();

    }
);


/* =========================================================
   LOAD CITY DETAIL
========================================================= */

async function loadCityDetail() {

    try {

        const cityId =
            getCityId();


        if (!cityId) {

            showError(
                "City was not specified in the URL."
            );

            return;

        }


        const response =
            await apiGet(
                `/cities/${cityId}`
            );


        if (
            !response ||
            response.success === false
        ) {

            showError(
                response?.message ||
                "Unable to load city information."
            );

            return;

        }


        const data =
            response.data;


        if (!data) {

            showError(
                "City information was not found."
            );

            return;

        }


        renderCity(
            data,
            cityId
        );

    }

    catch (error) {

        console.error(
            "City detail error:",
            error
        );


        showError(
            "Unable to load city information. Please try again."
        );

    }

}


/* =========================================================
   GET CITY ID
========================================================= */

function getCityId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    if (
        !id ||
        !/^[1-9]\d*$/.test(id)
    ) {

        return null;

    }


    return id;

}


/* =========================================================
   RENDER CITY
========================================================= */

function renderCity(
    city,
    cityId
) {

    const cityName =
        getValue(
            city.name,
            "Indian City"
        );


    const state =
        city.state || {};


    const stateName =
        getValue(
            state.name,
            "India"
        );


    /* =====================================================
       BASIC INFORMATION
    ===================================================== */

    setText(
        "cityName",
        cityName
    );


    setText(
        "cityState",
        stateName
    );


    setText(
        "breadcrumbState",
        stateName
    );


    setText(
        "breadcrumbCity",
        cityName
    );


    setText(
        "aboutCityTitle",
        `About ${cityName}`
    );


    setText(
        "mapCityName",
        cityName
    );


    setText(
        "mapCityCenterName",
        cityName
    );


    setText(
        "mapCityCenterState",
        stateName
    );


    setText(
        "mapStateLabel",
        stateName
    );


    setText(
        "locationTitle",
        `${cityName}, ${stateName}`
    );


    setText(
        "locationCity",
        cityName
    );


    setText(
        "locationState",
        `${stateName}, India`
    );


    /* =====================================================
       ABOUT
    ===================================================== */

    renderAbout(
        city
    );


    /* =====================================================
       HERO IMAGE
    ===================================================== */

    setHeroImage(
        city.image
    );


    /* =====================================================
       TOURIST PLACES
    ===================================================== */

    renderTouristPlaces(
        city.touristPlaces,
        cityId
    );


    /* =====================================================
       ACTIVITIES
    ===================================================== */

    renderActivities(
        city.activities
    );


    /* =====================================================
       BEST TIME
    ===================================================== */

    renderBestTime(
        city.bestTimeToVisit
    );


    /* =====================================================
       LOCATION
    ===================================================== */

    renderLocation(
        city.location,
        cityName,
        stateName
    );


    /* =====================================================
       NEARBY PLACES
    ===================================================== */

    renderNearbyPlaces(
        city.nearbyPlaces
    );


    /* =====================================================
       VIEW ALL PLACES
    ===================================================== */

    const viewAll =
        document.getElementById(
            "viewAllPlaces"
        );


    if (viewAll) {

        viewAll.href =
            `/pages/places.html?cityId=${encodeURIComponent(cityId)}`;

    }


    /* =====================================================
       PAGE TITLE
    ===================================================== */

    document.title =
        `${cityName} | Tourism India`;

}


/* =========================================================
   ABOUT CITY
========================================================= */

function renderAbout(city) {

    const about =
        getValue(
            city.about,
            DEFAULT_CITY_DESCRIPTION
        );


    setText(
        "cityDescription",
        about
    );

}


/* =========================================================
   HERO IMAGE
========================================================= */

function setHeroImage(
    image
) {

    const hero =
        document.getElementById(
            "cityHero"
        );


    if (!hero) {
        return;
    }


    const imageUrl =
        getImageUrl(
            image,
            DEFAULT_CITY_IMAGE
        );


    hero.style.backgroundImage = `

        linear-gradient(
            0deg,
            rgba(8, 29, 46, 0.88) 0%,
            rgba(8, 29, 46, 0.40) 48%,
            rgba(8, 29, 46, 0.08) 100%
        ),

        url("${escapeCssUrl(imageUrl)}")

    `;

}


/* =========================================================
   TOURIST PLACES
========================================================= */

function renderTouristPlaces(
    places,
    cityId
) {

    const grid =
        document.getElementById(
            "placesGrid"
        );


    if (!grid) {
        return;
    }


    const touristPlaces =
        Array.isArray(places)
            ? places
            : [];


    if (!touristPlaces.length) {

        grid.innerHTML = `

            <div class="city-empty">

                <p>
                    Tourist places for this city
                    will appear here soon.
                </p>

            </div>

        `;

        return;

    }


    /*
     * Show maximum 3 places
     * on the city detail page.
     */

    const visiblePlaces =
        touristPlaces.slice(
            0,
            3
        );


    grid.innerHTML =
        visiblePlaces
            .map(
                place =>
                    createTouristPlaceCard(
                        place
                    )
            )
            .join("");

}


/* =========================================================
   TOURIST PLACE CARD
========================================================= */

function createTouristPlaceCard(
    place
) {

    const id =
        place.touristPlaceId;


    const title =
        getValue(
            place.title,
            "Tourist Place"
        );


    const imageUrl =
        getImageUrl(
            place.image,
            DEFAULT_PLACE_IMAGE
        );


    const rating =
        place.rating || {};


    const average =
        rating.average;


    const totalReviews =
        rating.totalReviews;


    let ratingHtml = "";


    if (
        average !== null &&
        average !== undefined
    ) {

        ratingHtml = `

            <div class="city-place-rating">

                <span>
                    ★
                </span>

                <strong>
                    ${escapeHtml(average)}
                </strong>

                ${
                    totalReviews
                        ? `
                            <small>
                                (${escapeHtml(totalReviews)})
                            </small>
                          `
                        : ""
                }

            </div>

        `;

    }


    return `

        <a
            href="/pages/place.html?id=${encodeURIComponent(id || "")}"
            class="city-place-card"
        >

            <div
                class="city-place-image"
                style="
                    background-image:
                    url('${escapeCssUrl(imageUrl)}')
                "
            ></div>


            <div class="city-place-body">

                <h3>
                    ${escapeHtml(title)}
                </h3>


                ${
                    ratingHtml
                }

            </div>

        </a>

    `;

}


/* =========================================================
   ACTIVITIES / THINGS TO DO
========================================================= */

function renderActivities(
    activities
) {

    const container =
        document.getElementById(
            "thingsToDo"
        );


    if (!container) {
        return;
    }


    const activityList =
        Array.isArray(activities)
            ? activities
            : [];


    /*
     * Backend activities are currently
     * empty, so use default activities.
     */

    if (!activityList.length) {

        container.innerHTML =
            DEFAULT_THINGS_TO_DO
                .map(
                    activity =>
                        createActivityPill(
                            activity
                        )
                )
                .join("");

        return;

    }


    container.innerHTML =
        activityList
            .map(
                activity =>
                    createActivityPill(
                        activity
                    )
            )
            .join("");

}


/* =========================================================
   ACTIVITY PILL
========================================================= */

function createActivityPill(
    activity
) {

    const name =
        typeof activity === "string"

            ? activity

            : getValue(
                activity?.name,
                "Experience"
            );


    const icon =
        typeof activity === "object"

            ? (
                activity.icon ||
                getThingIcon(name)
            )

            : getThingIcon(name);


    return `

        <div class="thing-pill">

            <span>
                ${escapeHtml(icon)}
            </span>

            ${escapeHtml(name)}

        </div>

    `;

}


/* =========================================================
   THING ICON
========================================================= */

function getThingIcon(
    name
) {

    const value =
        String(
            name || ""
        ).toLowerCase();


    if (
        value.includes("adventure")
    ) {
        return "✦";
    }


    if (
        value.includes("trek") ||
        value.includes("hiking")
    ) {
        return "♟";
    }


    if (
        value.includes("nature") ||
        value.includes("wildlife")
    ) {
        return "♧";
    }


    if (
        value.includes("culture") ||
        value.includes("heritage")
    ) {
        return "♜";
    }


    if (
        value.includes("food") ||
        value.includes("cuisine")
    ) {
        return "◉";
    }


    if (
        value.includes("shopping")
    ) {
        return "◇";
    }


    if (
        value.includes("sight")
    ) {
        return "◎";
    }


    return "✦";

}


/* =========================================================
   BEST TIME
========================================================= */

function renderBestTime(
    bestTime
) {

    const element =
        document.getElementById(
            "bestTimeText"
        );


    if (!element) {
        return;
    }


    element.textContent =
        getValue(
            bestTime,
            DEFAULT_BEST_TIME
        );

}


/* =========================================================
   LOCATION
========================================================= */

function renderLocation(
    location,
    cityName,
    stateName
) {

    const locationData =
        location || {};


    const latitude =
        locationData.latitude;


    const longitude =
        locationData.longitude;


    const title =
        getValue(
            locationData.title,
            `${cityName}, ${stateName}`
        );


    setText(
        "locationTitle",
        title
    );


    setText(
        "locationCity",
        cityName
    );


    setText(
        "locationState",
        `${stateName}, India`
    );


    setText(
        "locationDescription",

        `Located in ${stateName}, ${cityName} is surrounded by destinations and experiences worth exploring.`
    );


    const map =
        document.getElementById(
            "cityMap"
        );


    if (
        map &&
        latitude !== null &&
        latitude !== undefined &&
        longitude !== null &&
        longitude !== undefined
    ) {

        map.dataset.latitude =
            latitude;


        map.dataset.longitude =
            longitude;

    }

}


/* =========================================================
   NEARBY PLACES
========================================================= */

function renderNearbyPlaces(
    places
) {

    const grid =
        document.getElementById(
            "nearbyPlaces"
        );


    if (!grid) {
        return;
    }


    const nearby =
        Array.isArray(places)
            ? places
            : [];


    if (!nearby.length) {

        grid.innerHTML = `

            <div class="city-empty">

                <p>
                    Nearby destinations will
                    appear here soon.
                </p>

            </div>

        `;

        return;

    }


    const visiblePlaces =
        nearby.slice(
            0,
            4
        );


    grid.innerHTML =
        visiblePlaces
            .map(
                place =>
                    createNearbyCard(
                        place
                    )
            )
            .join("");

}


/* =========================================================
   NEARBY CARD
========================================================= */

function createNearbyCard(
    place
) {

    const name =
        getValue(
            place.name,
            "Nearby Place"
        );


    const imageUrl =
        getImageUrl(
            place.image,
            DEFAULT_PLACE_IMAGE
        );


    const type =
        getValue(
            place.type,
            "Nearby destination"
        );


    return `

        <article
            class="nearby-card"
        >

            <div
                class="nearby-image"
                style="
                    background-image:
                    url('${escapeCssUrl(imageUrl)}')
                "
            ></div>


            <div class="nearby-body">

                <h3>
                    ${escapeHtml(name)}
                </h3>


                <p>
                    ${escapeHtml(type)}
                </p>

            </div>

        </article>

    `;

}


/* =========================================================
   GET IMAGE URL
========================================================= */

function getImageUrl(
    image,
    fallback
) {

    if (
        typeof image !== "string" ||
        !image.trim()
    ) {

        return fallback;

    }


    const url =
        image.trim();


    if (
        /^https?:\/\//i.test(url) ||
        /^\/(?!\/)/.test(url) ||
        /^images\//i.test(url)
    ) {

        return url;

    }


    return fallback;

}


/* =========================================================
   GET VALUE
========================================================= */

function getValue(
    value,
    fallback
) {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {

        return fallback;

    }


    return value;

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value ?? "";

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   ESCAPE CSS URL
========================================================= */

function escapeCssUrl(
    value
) {

    return String(
        value || ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /"/g,
            '\\"'
        )
        .replace(
            /\n/g,
            ""
        )
        .replace(
            /\r/g,
            ""
        );

}


/* =========================================================
   ERROR
========================================================= */

function showError(
    message
) {

    const main =
        document.querySelector(
            "main"
        );


    if (!main) {
        return;
    }


    main.innerHTML = `

        <section
            class="city-about-section"
        >

            <div
                class="city-container"
            >

                <div
                    class="city-empty"
                >

                    <h2>
                        Something went wrong
                    </h2>


                    <p>
                        ${escapeHtml(message)}
                    </p>


                    <br>


                    <a
                        href="/pages/states.html"
                        class="city-view-all"
                    >
                        Browse States →
                    </a>

                </div>

            </div>

        </section>

    `;

}