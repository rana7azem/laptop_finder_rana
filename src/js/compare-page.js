
import { fetchLaptops } from "./api.js";

import {
    getFavorites,
    getCompareIds,
    addToCompare,
    saveCompareIds
} from "./storage.js";

import {
    comparisonSpecs,
    getBestValue,
    formatSpecValue
} from "./compare.js";

const choices = document.getElementById("compare-choices");
const tableContainer = document.getElementById("compare-table");
const selectedCount = document.getElementById("selected-count");
const message = document.getElementById("compare-message");

let allLaptops = [];

// Show the selected laptop count
function updateCount() {
    selectedCount.textContent = `${getCompareIds().length} / 4 selected`;
}

// Show a loading skeleton
function showLoading() {
    choices.innerHTML = Array.from({ length: 3 }, () => `
        <div class="laptop-card animate-pulse">
            <div class="mb-3 h-6 rounded bg-gray-400/20"></div>
            <div class="h-10 rounded bg-gray-400/20"></div>
        </div>
    `).join("");
}

// Display favorites available for comparison
function renderChoices() {
    const favorites = getFavorites();
    const selected = getCompareIds();

    const available = allLaptops.filter(laptop =>
        favorites.includes(Number(laptop.id))
    );

    updateCount();

    if (available.length === 0) {
        choices.innerHTML = `
            <div class="laptop-card sm:col-span-2 lg:col-span-3">
                <p class="mb-4">No favorites saved yet.</p>
                <a href="./laptops.html" class="btn-action">
                    Browse Laptops
                </a>
            </div>
        `;
        return;
    }

    choices.innerHTML = available.map(laptop => {
        const isSelected = selected.includes(Number(laptop.id));

        return `
            <article class="laptop-card flex flex-col gap-3">
                <p class="font-bold">${laptop.name}</p>
                <p class="text-sm text-[var(--app-muted)]">
                    ${laptop.brand} · $${laptop.price.toLocaleString()}
                </p>

                <button
                    type="button"
                    data-compare-id="${laptop.id}"
                    aria-pressed="${isSelected}"
                    class="btn-action mt-auto text-sm">
                    ${isSelected ? "Remove from Compare" : "Add to Compare"}
                </button>
            </article>
        `;
    }).join("");
}

// Create one specification row
function createComparisonRow(spec, laptops) {
    const bestValue = spec.best
        ? getBestValue(laptops, spec.field, spec.best)
        : null;

    const cells = laptops.map(laptop => {
        const isBest = spec.best &&
            laptop[spec.field] === bestValue;

        return `
            <td class="min-w-40 border-b border-[var(--app-border)] p-4 text-center">
                <span class="${isBest
                    ? "rounded-lg bg-green-600 px-3 py-2 font-semibold text-white"
                    : ""}">
                    ${formatSpecValue(laptop, spec.field)}
                </span>
            </td>
        `;
    }).join("");

    return `
        <tr>
            <th scope="row"
                class="min-w-36 border-b border-[var(--app-border)] p-4 text-left">
                ${spec.label}
            </th>
            ${cells}
        </tr>
    `;
}

// Display the side-by-side comparison table
function renderComparison() {
    const selected = getCompareIds();

    const laptops = selected
        .map(id => allLaptops.find(laptop => Number(laptop.id) === id))
        .filter(Boolean);

    if (laptops.length < 2) {
        tableContainer.innerHTML = `
            <div class="laptop-card">
                <p class="text-[var(--app-muted)]">
                    Select at least 2 favorites to compare laptops.
                </p>
            </div>
        `;
        return;
    }

    const headers = laptops.map(laptop => `
        <th scope="col"
            class="min-w-40 border-b border-[var(--app-border)] p-4 text-center">
            <img
                src="${laptop.image}"
                alt="${laptop.name}"
                class="mx-auto mb-3 h-24 w-36 object-contain"
            >
            <span>${laptop.name}</span>
        </th>
    `).join("");

    const rows = comparisonSpecs
        .map(spec => createComparisonRow(spec, laptops))
        .join("");

    tableContainer.innerHTML = `
        <div class="overflow-x-auto rounded-xl bg-[var(--app-card)]">
            <table class="w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th scope="col"
                            class="min-w-36 border-b border-[var(--app-border)] p-4 text-left">
                            Specification
                        </th>
                        ${headers}
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

// Update the choices and comparison together
function renderPage() {
    renderChoices();
    renderComparison();
}

// Handle selection and removal
choices.addEventListener("click", event => {
    const button = event.target.closest("[data-compare-id]");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.compareId);
    const selected = getCompareIds();

    if (selected.includes(id)) {
        saveCompareIds(selected.filter(item => item !== id));
        message.textContent = "Laptop removed from comparison.";
    } else {
        const result = addToCompare(id);

        if (result === "added") {
            message.textContent = "Laptop added to comparison.";
        } else if (result === "full") {
            message.textContent =
                "You can compare a maximum of 4 laptops.";
        } else if (result === "not-favorite") {
            message.textContent =
                "Only saved favorites can be compared.";
        } else {
            message.textContent =
                "Laptop is already selected.";
        }
    }

    renderPage();
});

// Load data and display the page
async function initializeComparison() {
    showLoading();
    message.textContent = "Loading laptops...";

    try {
        allLaptops = await fetchLaptops();

        // Only keep selections that are still favorites.
        const favorites = getFavorites();
        const validIds = getCompareIds().filter(id =>
            favorites.includes(id) &&
            allLaptops.some(laptop => Number(laptop.id) === id)
        );

        saveCompareIds([...new Set(validIds)].slice(0, 4));

        message.textContent = "";
        renderPage();

    } catch (error) {
        choices.innerHTML = "";
        tableContainer.innerHTML = "";
        message.textContent =
            "Could not load comparison data. Please try again.";
        message.setAttribute("role", "alert");
    }
}

initializeComparison();
