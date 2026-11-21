
import { fetchLaptops } from "./api.js";
import {
    getFavorites,
    toggleFavorite,
    clearFavorites
} from "./storage.js";
import { createLaptopCard } from "./cards.js";

const favoritesGrid = document.getElementById("favorites-grid");
const favoritesCount = document.getElementById("favorites-count");
const totalPrice = document.getElementById("total-price");
const averagePrice = document.getElementById("average-price");
const feedback = document.getElementById("favorites-feedback");
const clearButton = document.getElementById("clear-favorites");

let allLaptops = [];

// Format prices
const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
};

// Show loading skeletons
function showLoading() {
    favoritesGrid.innerHTML = Array.from({ length: 3 }, () => `
        <div class="laptop-card animate-pulse">
            <div class="mb-4 h-44 rounded bg-gray-400/20"></div>
            <div class="mb-3 h-6 w-3/4 rounded bg-gray-400/20"></div>
            <div class="h-24 rounded bg-gray-400/20"></div>
        </div>
    `).join("");
}

// Display saved laptops and calculate prices
function renderFavorites() {
    const savedIds = getFavorites();

    const favorites = allLaptops.filter(laptop =>
        savedIds.includes(Number(laptop.id))
    );

    const total = favorites.reduce(
        (sum, laptop) => sum + laptop.price,
        0
    );

    const average = favorites.length > 0
        ? total / favorites.length
        : 0;

    favoritesCount.textContent = favorites.length;
    totalPrice.textContent = formatPrice(total);
    averagePrice.textContent = formatPrice(average);

    clearButton.disabled = favorites.length === 0;

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = "";

        feedback.innerHTML = `
            <div class="laptop-card text-center">
                <h2 class="mb-3 text-xl font-bold">
                    No favorites yet
                </h2>

                <p class="mb-5 text-[var(--app-muted)]">
                    Save laptops from the catalogue to see them here.
                </p>

                <a href="./laptops.html" class="btn-action">
                    Browse Laptops
                </a>
            </div>
        `;
        return;
    }

    feedback.innerHTML = "";

    favoritesGrid.innerHTML = favorites
        .map(laptop => createLaptopCard(laptop))
        .join("");
}

// Handle removing a single favorite
favoritesGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite-id]");

    if (!button) {
        return;
    }

    toggleFavorite(Number(button.dataset.favoriteId));

    renderFavorites();
});

// Handle clearing all favorites
clearButton.addEventListener("click", () => {
    clearFavorites();
    renderFavorites();
});

// Load laptop data
async function initializeFavorites() {
    showLoading();

    try {
        allLaptops = await fetchLaptops();
        renderFavorites();

    } catch (error) {
        favoritesGrid.innerHTML = "";

        feedback.textContent =
            "Could not load your favorites. Please try again.";

        feedback.setAttribute("role", "alert");
    }
}

initializeFavorites();
