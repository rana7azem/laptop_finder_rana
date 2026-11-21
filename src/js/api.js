export async function fetchLaptops() {
    try {
        const response = await fetch("./data/laptops.json");

        if (!response.ok) {
            throw new Error(`Could not load laptops (${response.status})`);
        }

        const laptops = await response.json();

        if (!Array.isArray(laptops)) {
            throw new Error("Laptop data must be an array");
        }

        return laptops;
    } catch (error) {
        console.error("Failed to load laptops:", error);
        throw error;
    }
}
