
const THEME_KEY = "laptopFinderTheme";
const FAVORITES_KEY = "laptopFinderFavorites";

// Theme functions
export const getTheme = () => {
    return JSON.parse(localStorage.getItem(THEME_KEY)) || "battery";
};

export const saveTheme = (theme) => {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
};

// Favorites functions
export const getFavorites = () => {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
};

export const saveFavorites = (favorites) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const isFavorite = (id) => {
    return getFavorites().includes(Number(id));
};

export function toggleFavorite(id) {
    const laptopId = Number(id);
    const favorites = getFavorites();

    const updatedFavorites = favorites.includes(laptopId)
        ? favorites.filter(favoriteId => favoriteId !== laptopId)
        : [...favorites, laptopId];

    saveFavorites(updatedFavorites);

    return updatedFavorites;
}
