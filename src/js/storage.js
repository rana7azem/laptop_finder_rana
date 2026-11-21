
const THEME_KEY = "laptopFinderTheme";
const FAVORITES_KEY = "laptopFinderFavorites";
const COMPARE_KEY = "laptopFinderCompare";

// Theme
export const getTheme = () => {
    return JSON.parse(localStorage.getItem(THEME_KEY)) || "battery";
};

export const saveTheme = (theme) => {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
};

// Favorites
export const getFavorites = () => {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
};

export const saveFavorites = (favorites) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const isFavorite = (id) => {
    return getFavorites().includes(Number(id));
};

// Comparison
export const getCompareIds = () => {
    return JSON.parse(localStorage.getItem(COMPARE_KEY)) || [];
};

export const saveCompareIds = (ids) => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
};

export function addToCompare(id) {
    const laptopId = Number(id);
    const selected = getCompareIds();

    if (selected.includes(laptopId)) {
        return "already";
    }

    if (selected.length >= 4) {
        return "full";
    }

    // Comparison laptops must also be favorites.
    if (!isFavorite(laptopId)) {
        return "not-favorite";
    }

    saveCompareIds([...selected, laptopId]);

    return "added";
}

// Add or remove a favorite
export function toggleFavorite(id) {
    const laptopId = Number(id);
    const favorites = getFavorites();

    const updatedFavorites = favorites.includes(laptopId)
        ? favorites.filter(savedId => savedId !== laptopId)
        : [...favorites, laptopId];

    saveFavorites(updatedFavorites);

    // Remove from comparison if no longer a favorite.
    if (!updatedFavorites.includes(laptopId)) {
        saveCompareIds(
            getCompareIds().filter(savedId => savedId !== laptopId)
        );
    }

    return updatedFavorites;
}

// Remove every saved favorite
export function clearFavorites() {
    saveFavorites([]);
    saveCompareIds([]);
}
