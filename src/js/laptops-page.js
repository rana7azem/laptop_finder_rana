
import { fetchLaptops } from "./api.js";
import { toggleFavorite } from "./storage.js";
import { createLaptopCard } from "./cards.js";

let allLaptops = [];

// Get elements
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const maxPriceInput = document.getElementById("max-price");
const minRamFilter = document.getElementById("min-ram");
const sortSelect = document.getElementById("sort-select");
const laptopGrid = document.getElementById("laptop-grid");
const resultCount = document.getElementById("result-count");
const feedback = document.getElementById("catalogue-feedback");

// Loading skeleton
function showLoading() {
    laptopGrid.innerHTML = Array.from({ length: 6 }, () => `
        <div class="laptop-card animate-pulse">
            <div class="mb-4 h-44 rounded-lg bg-gray-400/20"></div>
            <div class="mb-3 h-5 w-3/4 rounded bg-gray-400/20"></div>
            <div class="mb-4 h-7 w-1/2 rounded bg-gray-400/20"></div>
            <div class="h-24 rounded bg-gray-400/20"></div>
        </div>
    `).join("");
}

// Apply all filters together
function getFilteredLaptops() {
    const search = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const maxPrice = Number(maxPriceInput.value);
    const minRam = Number(minRamFilter.value);

    return allLaptops.filter(laptop => {
        const matchesSearch =
            laptop.name.toLowerCase().includes(search) ||
            laptop.brand.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" || laptop.category === category;

        const matchesPrice =
            maxPriceInput.value === "" || laptop.price <= maxPrice;

        const matchesRam = laptop.ramGB >= minRam;

        return matchesSearch &&
               matchesCategory &&
               matchesPrice &&
               matchesRam;
    });
}

// Sort a copy of the filtered array
function sortLaptops(laptops) {
    const [field, direction] = sortSelect.value.split("-");
    const multiplier = direction === "asc" ? 1 : -1;

    return [...laptops].sort((a, b) => {
        return (a[field] - b[field]) * multiplier;
    });
}

// Update cards and result count
function renderLaptops() {
    const filtered = getFilteredLaptops();
    const sorted = sortLaptops(filtered);

    resultCount.textContent =
        `${sorted.length} laptop(s) found`;

    feedback.textContent = "";

    if (sorted.length === 0) {
        laptopGrid.innerHTML = "";

        feedback.textContent =
            "No laptops match your search or filters.";
        return;
    }

    laptopGrid.innerHTML = sorted
        .map(laptop => createLaptopCard(laptop))
        .join("");
}

// Listen to search and filters
searchInput.addEventListener("input", renderLaptops);
maxPriceInput.addEventListener("input", renderLaptops);

categoryFilter.addEventListener("change", renderLaptops);
minRamFilter.addEventListener("change", renderLaptops);
sortSelect.addEventListener("change", renderLaptops);

// Handle favorite buttons
laptopGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite-id]");

    if (!button) {
        return;
    }

    toggleFavorite(Number(button.dataset.favoriteId));
    renderLaptops();
});

// Load laptop data
async function initializeCatalogue() {
    showLoading();
    resultCount.textContent = "Loading laptops...";

    try {
        allLaptops = await fetchLaptops();
        renderLaptops();

    } catch (error) {
        laptopGrid.innerHTML = "";
        resultCount.textContent = "Unable to load laptops";

        feedback.textContent =
            "Could not load laptop data. Please refresh and try again.";
        feedback.setAttribute("role", "alert");
    }
}

initializeCatalogue();
