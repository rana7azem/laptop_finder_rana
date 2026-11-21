
import { fetchLaptops } from "./api.js";
import {
    isFavorite,
    toggleFavorite,
    getFavorites
} from "./storage.js";
import { addToCompare } from "./storage.js";

const container = document.getElementById("details-content");

// Read laptop ID from the URL
const params = new URLSearchParams(window.location.search);
const laptopId = Number(params.get("id"));

// Create a specifications table row
const createSpecRow = (label, value) => {
    return `
        <tr class="border-b border-[var(--app-border)]">
            <th scope="row"
                class="p-3 text-left font-semibold">
                ${label}
            </th>
            <td class="p-3 text-[var(--app-muted)]">
                ${value}
            </td>
        </tr>
    `;
};

// Display loading skeleton
function showLoading() {
    container.innerHTML = `
        <div class="laptop-card animate-pulse">
            <div class="mb-6 h-64 rounded-lg bg-gray-400/20"></div>
            <div class="mb-4 h-8 w-2/3 rounded bg-gray-400/20"></div>
            <div class="mb-4 h-6 w-1/3 rounded bg-gray-400/20"></div>
            <div class="h-40 rounded bg-gray-400/20"></div>
        </div>
    `;
}

// Display laptop details
function renderDetails(laptop) {
    const specifications = [
        ["ID", laptop.id],
        ["Name", laptop.name],
        ["Brand", laptop.brand],
        ["Price", `$${laptop.price.toLocaleString()}`],
        ["Category", laptop.category],
        ["CPU", laptop.cpu],
        ["RAM", `${laptop.ramGB} GB`],
        ["Storage", `${laptop.storageGB} GB`],
        ["Battery Life", `${laptop.batteryHours} hours`],
        ["Weight", `${laptop.weightKg} kg`],
        ["Screen Size", `${laptop.screenInches} inches`],
        ["Image Path", laptop.image],
        ["Description", laptop.description]
    ];

    const saved = isFavorite(laptop.id);

    container.innerHTML = `
        <article class="laptop-card">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">

                <!-- Laptop Image -->
                <div class="flex items-center justify-center">
                    <img
                        src="${laptop.image}"
                        alt="${laptop.name}"
                        class="h-72 w-full rounded-lg object-contain"
                    >
                </div>

                <!-- Laptop Information -->
                <div>
                    <p class="mb-2 text-[var(--app-muted)]">
                        ${laptop.brand} · ${laptop.category}
                    </p>

                    <h1 class="mb-4 text-3xl font-bold">
                        ${laptop.name}
                    </h1>

                    <p class="mb-5 text-3xl font-bold text-[var(--app-accent)]">
                        $${laptop.price.toLocaleString()}
                    </p>

                    <p class="mb-6 text-[var(--app-muted)]">
                        ${laptop.description}
                    </p>

                    <div class="flex flex-wrap gap-3">

                        <button
                            id="favorite-button"
                            type="button"
                            aria-pressed="${saved}"
                            class="btn-action">
                            ${saved ? "♥ Remove Favorite" : "♡ Add to Favorites"}
                        </button>

                        <button
                            id="compare-button"
                            type="button"
                            class="cursor-pointer rounded-lg border border-[var(--app-border)] px-5 py-3 font-semibold transition hover:text-[var(--app-accent)] focus-visible:outline-2 focus-visible:outline-[var(--app-accent)]">
                            Add to Comparison
                        </button>

                    </div>

                    <p id="details-message"
                       role="status"
                       aria-live="polite"
                       class="mt-4 text-sm text-[var(--app-muted)]">
                    </p>
                </div>

            </div>

            <!-- Specifications -->
            <section class="mt-10">
                <h2 class="mb-5 text-2xl font-bold">
                    Full Specifications
                </h2>

                <div class="overflow-x-auto">
                    <table class="w-full border-collapse text-sm">
                        <tbody>
                            ${specifications
                                .map(spec => createSpecRow(spec[0], spec[1]))
                                .join("")}
                        </tbody>
                    </table>
                </div>
            </section>

        </article>
    `;

    // Handle favorite button
    document.getElementById("favorite-button")
        .addEventListener("click", () => {
            const button = document.getElementById("favorite-button");

            toggleFavorite(laptop.id);

            const savedNow = isFavorite(laptop.id);

            button.textContent = savedNow
                ? "♥ Remove Favorite"
                : "♡ Add to Favorites";

            button.setAttribute("aria-pressed", String(savedNow));

            document.getElementById("details-message")
                .textContent = savedNow
                    ? "Laptop added to favorites."
                    : "Laptop removed from favorites.";
        });

    // Handle comparison button
    document.getElementById("compare-button")
        .addEventListener("click", () => {
            if (!getFavorites().includes(Number(laptop.id))) {
                toggleFavorite(laptop.id);
            }

            const favoriteButton =
                document.getElementById("favorite-button");

            favoriteButton.textContent = "♥ Remove Favorite";
            favoriteButton.setAttribute("aria-pressed", "true");

            const result = addToCompare(laptop.id);
            const message = document.getElementById("details-message");

            if (result === "added") {
                message.textContent =
                    "Laptop added to comparison. Open Compare to view it.";
            } else if (result === "already") {
                message.textContent =
                    "This laptop is already selected for comparison.";
            } else {
                message.textContent =
                    "You can compare a maximum of 4 laptops.";
            }
        });
}

// Load the selected laptop
async function initializeDetails() {
    if (!params.has("id") ||
        !Number.isInteger(laptopId) ||
        laptopId <= 0) {

        container.innerHTML = `
            <p role="alert" class="laptop-card">
                Invalid or missing laptop ID.
                <a href="./laptops.html"
                   class="font-semibold text-[var(--app-accent)] underline">
                    Browse laptops
                </a>
            </p>
        `;
        return;
    }

    showLoading();

    try {
        const laptops = await fetchLaptops();

        const laptop = laptops.find(
            item => Number(item.id) === laptopId
        );

        if (!laptop) {
            container.innerHTML = `
                <p role="alert" class="laptop-card">
                    Laptop not found.
                    <a href="./laptops.html"
                       class="font-semibold text-[var(--app-accent)] underline">
                        Back to catalogue
                    </a>
                </p>
            `;
            return;
        }

        renderDetails(laptop);

    } catch (error) {
        container.innerHTML = `
            <p role="alert"
               class="laptop-card text-red-500">
                Could not load laptop details. Please try again.
            </p>
        `;
    }
}

initializeDetails();
