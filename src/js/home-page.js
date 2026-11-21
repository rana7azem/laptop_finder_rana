
import { fetchLaptops } from "./api.js";
import { getFavorites, toggleFavorite } from "./storage.js";
import { createLaptopCard } from "./cards.js";

// Reusable statistics card
const createStatCard = (label, value) => {
    return `
        <article class="laptop-card text-center">
            <h3 class="mb-2 text-sm text-[var(--app-muted)]">
                ${label}
            </h3>

            <p class="text-3xl font-bold text-[var(--app-accent)]">
                ${value}
            </p>
        </article>
    `;
};

// Show loading skeletons
function showLoading(container) {
    container.innerHTML = Array.from({ length: 3 }, () => `
        <div class="laptop-card animate-pulse">
            <div class="mx-auto mb-4 h-4 w-24 rounded bg-gray-400/30"></div>
            <div class="mx-auto h-8 w-16 rounded bg-gray-400/30"></div>
        </div>
    `).join("");
}

// Calculate statistics from JSON data
function calculateStatistics(laptops) {
    const lowestPrice = laptops.reduce(
        (lowest, laptop) => Math.min(lowest, laptop.price),
        Infinity
    );

    const favoriteIds = getFavorites();

    const savedCount = laptops.reduce(
        (count, laptop) =>
            count + (favoriteIds.includes(Number(laptop.id)) ? 1 : 0),
        0
    );

    return [
        {
            label: "Total Laptops",
            value: laptops.length
        },
        {
            label: "Lowest Price",
            value: `$${lowestPrice.toLocaleString()}`
        },
        {
            label: "Saved Favorites",
            value: savedCount
        }
    ];
}

// Render statistics cards
function renderStatistics(laptops) {
    const statsContainer = document.getElementById("home-stats");

    if (!statsContainer) {
        return;
    }

    const statistics = calculateStatistics(laptops);

    statsContainer.innerHTML = statistics
        .map(stat => createStatCard(stat.label, stat.value))
        .join("");
}

// Handle featured laptop favorite button
function initializeFeaturedFavorite(laptops) {
    const featuredContainer = document.getElementById("featured-laptop");

    if (!featuredContainer) {
        return;
    }

    featuredContainer.addEventListener("click", event => {
        const button = event.target.closest("[data-favorite-id]");

        if (!button) {
            return;
        }

        const laptopId = Number(button.dataset.favoriteId);

        toggleFavorite(laptopId);

        const saved = getFavorites().includes(laptopId);

        button.textContent = saved ? "♥ Saved" : "♡ Save";
        button.setAttribute("aria-pressed", String(saved));

        // Update saved favorites count immediately
        renderStatistics(laptops);
    });
}

// Load statistics and featured laptop
async function loadHomeStatistics() {
    const statsContainer = document.getElementById("home-stats");
    const featuredContainer = document.getElementById("featured-laptop");

    if (!statsContainer) {
        return;
    }

    showLoading(statsContainer);

    if (featuredContainer) {
        featuredContainer.innerHTML = `
            <div class="laptop-card animate-pulse">
                <div class="mb-4 h-44 rounded-lg bg-gray-400/20"></div>
                <div class="mb-3 h-6 rounded bg-gray-400/20"></div>
                <div class="h-24 rounded bg-gray-400/20"></div>
            </div>
        `;
    }

    try {
        const laptops = await fetchLaptops();

        if (laptops.length === 0) {
            statsContainer.innerHTML = `
                <p class="text-[var(--app-muted)]">
                    No laptops are available yet.
                </p>
            `;

            if (featuredContainer) {
                featuredContainer.innerHTML = "";
            }

            return;
        }

        // Display home statistics
        renderStatistics(laptops);

        // Display featured laptop
        if (featuredContainer) {
            featuredContainer.innerHTML =
                createLaptopCard(laptops[0]);

            initializeFeaturedFavorite(laptops);
        }

    } catch (error) {
        statsContainer.innerHTML = `
            <p role="alert"
               class="col-span-full rounded-lg border border-red-500 p-4 text-red-500">
                Could not load laptop statistics. Please try again.
            </p>
        `;

        if (featuredContainer) {
            featuredContainer.innerHTML = `
                <p role="alert" class="text-red-500">
                    Could not load featured laptop.
                </p>
            `;
        }
    }
}

loadHomeStatistics();
