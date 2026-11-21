
import { isFavorite } from "./storage.js";

// Create a reusable laptop card
export const createLaptopCard = (laptop) => {
    const saved = isFavorite(laptop.id);

    return `
        <article class="laptop-card flex flex-col gap-4">
            <a href="./details.html?id=${laptop.id}">
                <img
                    src="${laptop.image}"
                    alt="${laptop.name}"
                    loading="lazy"
                    class="h-44 w-full rounded-lg object-contain"
                >
            </a>

            <div class="flex flex-1 flex-col gap-3">
                <div>
                    <p class="text-sm text-[var(--app-muted)]">
                        ${laptop.brand} · ${laptop.category}
                    </p>

                    <h3 class="mt-1 text-lg font-bold">
                        ${laptop.name}
                    </h3>
                </div>

                <p class="text-2xl font-bold text-[var(--app-accent)]">
                    $${laptop.price.toLocaleString()}
                </p>

                <div class="space-y-1 text-sm text-[var(--app-muted)]">
                    <p>CPU: ${laptop.cpu}</p>
                    <p>RAM: ${laptop.ramGB} GB</p>
                    <p>Storage: ${laptop.storageGB} GB</p>
                    <p>Battery: ${laptop.batteryHours} hours</p>
                    <p>Weight: ${laptop.weightKg} kg</p>
                </div>

                <div class="mt-auto flex flex-wrap gap-2 pt-3">
                    <a
                        href="./details.html?id=${laptop.id}"
                        class="btn-action text-sm">
                        View Details
                    </a>

                    <button
                        type="button"
                        data-favorite-id="${laptop.id}"
                        aria-pressed="${saved}"
                        class="cursor-pointer rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold transition hover:text-[var(--app-accent)] focus-visible:outline-2 focus-visible:outline-[var(--app-accent)]">
                        ${saved ? "♥ Saved" : "♡ Save"}
                    </button>
                </div>
            </div>
        </article>
    `;
};
