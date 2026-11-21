
const THEME_KEY = "laptopFinderTheme";

export const getTheme = () => {
    return JSON.parse(localStorage.getItem(THEME_KEY)) || "battery";
};

export const saveTheme = (theme) => {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
};
