
import { fetchLaptops } from "./api.js";
import { getFavorites } from "./storage.js";

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

// Calculate statistics from the JSON data
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

// Load and display home statistics
async function loadHomeStatistics() {
    const container = document.getElementById("home-stats");

    if (!container) {
        return;
    }

    showLoading(container);

    try {
        const laptops = await fetchLaptops();

        if (laptops.length === 0) {
            container.innerHTML = `
                <p class="text-[var(--app-muted)]">
                    No laptops are available yet.
                </p>
            `;
            return;
        }

        const statistics = calculateStatistics(laptops);

        container.innerHTML = statistics
            .map(stat => createStatCard(stat.label, stat.value))
            .join("");

    } catch (error) {
        container.innerHTML = `
            <p role="alert" class="col-span-full rounded-lg border border-red-500 p-4 text-red-500">
                Could not load laptop statistics. Please try again.
            </p>
        `;
    }
}

loadHomeStatistics();
