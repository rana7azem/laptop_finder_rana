
import { getTheme, saveTheme } from "./storage.js";

// Apply the selected theme
export function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    const themeButton = document.getElementById("theme-toggle");

    if (themeButton) {
        themeButton.textContent = theme === "battery"
            ? "Switch to Performance Mode"
            : "Switch to Battery Saver Mode";
    }
}

// Initialize theme switching
export function initializeTheme() {
    applyTheme(getTheme());

    const themeButton = document.getElementById("theme-toggle");

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            const newTheme = getTheme() === "battery"
                ? "performance"
                : "battery";

            saveTheme(newTheme);
            applyTheme(newTheme);
        });
    }
}

// Initialize mobile navigation
export function initializeMobileMenu() {
    const menuButton = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (!menuButton || !navLinks) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const isOpening = navLinks.classList.contains("hidden");

        navLinks.classList.toggle("hidden", !isOpening);
        navLinks.classList.toggle("flex", isOpening);

        menuButton.setAttribute("aria-expanded", String(isOpening));
    });
}
