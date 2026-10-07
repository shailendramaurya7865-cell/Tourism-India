/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener("DOMContentLoaded", () => {

    loadPlace();

});


/* =========================================================
   LOAD PLACE
========================================================= */

async function loadPlace() {

    const loading =
        document.getElementById("loading");

    const error =
        document.getElementById("error");

    const placeContent =
        document.getElementById("placeContent");


    try {

        /* ---------------------------------------------
           Get ID from URL
        --------------------------------------------- */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const placeId =
            params.get("id");


        console.log(
            "[PLACE] Place ID:",
            placeId
        );


        /* ---------------------------------------------
           Validate ID
        --------------------------------------------- */

        if (!placeId) {

            showError(
                "Invalid place ID."
            );

            return;
        }


        /* ---------------------------------------------
           API Request
        --------------------------------------------- */

        const place =
            await getPlaceById(placeId);


        console.log(
            "[PLACE] Place data:",
            place
        );


        /* ---------------------------------------------
           Validate response
        --------------------------------------------- */

        if (!place) {

            showError(
                "Place not found."
            );

            return;
        }


        /* ---------------------------------------------
           Render
        --------------------------------------------- */

        renderPlace(place);


        /* ---------------------------------------------
           Show content
        --------------------------------------------- */

        loading.style.display = "none";

        error.style.display = "none";

        placeContent.style.display = "block";


    } catch (error) {

        console.error(
            "[PLACE] Failed to load place:",
            error
        );


        showError(
            "Unable to load place details. Please try again later."
        );

    }

}


/* =========================================================
   SHOW ERROR
========================================================= */

function showError(message) {

    const loading =
        document.getElementById("loading");

    const error =
        document.getElementById("error");

    const errorMessage =
        document.getElementById("errorMessage");

    const placeContent =
        document.getElementById("placeContent");


    loading.style.display = "none";

    placeContent.style.display = "none";

    error.style.display = "block";

    errorMessage.textContent = message;

}


/* =========================================================
   RENDER PLACE
========================================================= */

function renderPlace(place) {

    console.log(
        "[PLACE] Rendering:",
        place
    );


    /* =====================================================
       BASIC INFORMATION
    ===================================================== */

    const placeName =
        place.name || "Unknown Place";


    const cityName =
        place.city?.name || "";


    const stateName =
        place.state?.name || "";


    /* =====================================================
       HERO
    ===================================================== */

    const heroImage =
        document.getElementById("heroImage");


    /*
       If your API later provides an image URL,
       use it here.

       Example:

       place.imageUrl

       or

       place.image?.url
    */

    const imageUrl =
        place.imageUrl ||
        place.image?.url ||
        place.coverImageUrl ||
        null;


    if (imageUrl) {

        heroImage.src = imageUrl;

    }


    heroImage.alt =
        placeName;


    /* =====================================================
       BREADCRUMB
    ===================================================== */

    document.getElementById(
        "breadcrumb"
    ).textContent =
        `Home / Explore / ${placeName}`;


    /* =====================================================
       PLACE NAME
    ===================================================== */

    document.getElementById(
        "placeName"
    ).textContent =
        placeName;


    /* =====================================================
       LOCATION
    ===================================================== */

    let locationText = "";


    if (cityName) {

        locationText += cityName;

    }


    if (stateName) {

        if (locationText) {

            locationText += ", ";

        }

        locationText += stateName;

    }


    document.getElementById(
        "placeLocation"
    ).textContent =
        locationText;


    /* =====================================================
       RATING
    ===================================================== */

    renderRating(place);


    /* =====================================================
       ABOUT
    ===================================================== */

    document.getElementById(
        "aboutTitle"
    ).textContent =
        `About ${placeName}`;


    document.getElementById(
        "description"
    ).textContent =
        place.description ||
        "No description available.";


    const shortDescription =
        document.getElementById(
            "shortDescription"
        );


    if (place.shortDescription) {

        shortDescription.textContent =
            place.shortDescription;

        shortDescription.style.display =
            "block";

    } else {

        shortDescription.style.display =
            "none";

    }


    /* =====================================================
       CATEGORIES
    ===================================================== */

    renderCategories(
        place.categories
    );


    /* =====================================================
       LOCATION DETAILS
    ===================================================== */

    renderLocation(
        place
    );


    /* =====================================================
       QUICK INFORMATION
    ===================================================== */

    renderQuickInformation(
        place
    );


    /* =====================================================
       MAP
    ===================================================== */

    renderMap(
        place
    );

}


/* =========================================================
   RATING
========================================================= */

function renderRating(place) {

    const ratingElement =
        document.getElementById(
            "placeRating"
        );


    const ratingCard =
        document.getElementById(
            "ratingCard"
        );


    const ratingAvg =
        document.getElementById(
            "ratingAvg"
        );


    const reviewCount =
        document.getElementById(
            "reviewCount"
        );


    const rating =
        place.rating;


    if (!rating) {

        ratingElement.textContent = "";

        ratingCard.style.display =
            "none";

        return;
    }


    const average =
        rating.average;


    const totalReviews =
        rating.totalReviews || 0;


    if (
        average === null ||
        average === undefined
    ) {

        ratingElement.textContent = "";

        ratingCard.style.display =
            "none";

        return;
    }


    /* Hero rating */

    ratingElement.innerHTML =
        `⭐ ${escapeHtml(average)}
         <span>
            (${escapeHtml(totalReviews)} reviews)
         </span>`;


    /* Sidebar rating */

    ratingAvg.innerHTML =
        `⭐ ${escapeHtml(average)}`;


    reviewCount.textContent =
        `${totalReviews} reviews`;


    ratingCard.style.display =
        "block";

}


/* =========================================================
   CATEGORIES
========================================================= */

function renderCategories(categories) {

    const categoriesCard =
        document.getElementById(
            "categoriesCard"
        );


    const categoriesContainer =
        document.getElementById(
            "categories"
        );


    if (
        !categories ||
        categories.length === 0
    ) {

        categoriesCard.style.display =
            "none";

        return;
    }


    categoriesContainer.innerHTML =
        categories
            .map(category => {

                return `
                    <span class="category">
                        ${escapeHtml(category.name)}
                    </span>
                `;

            })
            .join("");


    categoriesCard.style.display =
        "block";

}


/* =========================================================
   LOCATION
========================================================= */

function renderLocation(place) {

    const location =
        place.location || {};


    const addressElement =
        document.getElementById(
            "address"
        );


    const coordinatesElement =
        document.getElementById(
            "coordinates"
        );


    /* ---------------------------------------------
       Address
    --------------------------------------------- */

    if (location.address) {

        addressElement.textContent =
            location.address;

        addressElement.style.display =
            "block";

    } else {

        addressElement.textContent =
            "Address information unavailable.";

    }


    /* ---------------------------------------------
       Coordinates
    --------------------------------------------- */

    if (
        location.latitude !== null &&
        location.latitude !== undefined &&
        location.longitude !== null &&
        location.longitude !== undefined
    ) {

        coordinatesElement.textContent =
            `Coordinates: ${location.latitude}, ${location.longitude}`;

    } else {

        coordinatesElement.textContent =
            "";

    }

}


/* =========================================================
   QUICK INFORMATION
========================================================= */

function renderQuickInformation(place) {

    /* ---------------------------------------------
       State
    --------------------------------------------- */

    document.getElementById(
        "state"
    ).textContent =
        place.state?.name ||
        "Unavailable";


    /* ---------------------------------------------
       City
    --------------------------------------------- */

    document.getElementById(
        "city"
    ).textContent =
        place.city?.name ||
        "Unavailable";


    /* ---------------------------------------------
       Timings
    --------------------------------------------- */

    const timings =
        place.timings || {};


    document.getElementById(
        "openTime"
    ).textContent =
        timings.openTime ||
        "Unavailable";


    document.getElementById(
        "closeTime"
    ).textContent =
        timings.closeTime ||
        "Unavailable";


    /* ---------------------------------------------
       Closed Days
    --------------------------------------------- */

    const closedDays =
        timings.closedDays;


    if (
        Array.isArray(closedDays) &&
        closedDays.length > 0
    ) {

        document.getElementById(
            "closedDays"
        ).textContent =
            closedDays.join(", ");

    } else {

        document.getElementById(
            "closedDays"
        ).textContent =
            "None";

    }


    /* ---------------------------------------------
       Entry Fee
    --------------------------------------------- */

    const entryFee =
        place.entryFee || {};


    const entryFeeElement =
        document.getElementById(
            "entryFee"
        );


    if (
        entryFee.indianAdult !== null &&
        entryFee.indianAdult !== undefined
    ) {

        const fee =
            Number(entryFee.indianAdult);


        if (fee === 0) {

            entryFeeElement.textContent =
                "Free";

        } else {

            entryFeeElement.textContent =
                `₹${fee}`;

        }

    } else {

        entryFeeElement.textContent =
            "Unavailable";

    }

}


/* =========================================================
   MAP
========================================================= */

function renderMap(place) {

    const mapFrame =
        document.getElementById(
            "mapFrame"
        );


    const location =
        place.location || {};


    const latitude =
        location.latitude;


    const longitude =
        location.longitude;


    if (
        latitude === null ||
        latitude === undefined ||
        longitude === null ||
        longitude === undefined
    ) {

        mapFrame.style.display =
            "none";

        return;
    }


    /*
       OpenStreetMap embed.

       No API key is required.
    */

    const delta = 0.01;


    const bbox =
        `${longitude - delta},` +
        `${latitude - delta},` +
        `${longitude + delta},` +
        `${latitude + delta}`;


    mapFrame.src =
        `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}`;


    mapFrame.style.display =
        "block";

}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}