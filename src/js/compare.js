
// Find the best value for a numeric specification
export const getBestValue = (laptops, field, direction) => {
    const values = laptops.map(laptop => laptop[field]);

    return direction === "lowest"
        ? Math.min(...values)
        : Math.max(...values);
};

// Define which specifications can be compared
export const comparisonSpecs = [
    { label: "Brand", field: "brand" },
    { label: "Category", field: "category" },
    { label: "CPU", field: "cpu" },
    { label: "Price", field: "price", best: "lowest" },
    { label: "RAM", field: "ramGB", best: "highest" },
    { label: "Storage", field: "storageGB", best: "highest" },
    { label: "Battery Life", field: "batteryHours", best: "highest" },
    { label: "Weight", field: "weightKg", best: "lowest" },
    { label: "Screen Size", field: "screenInches" }
];

// Format values with their units
export const formatSpecValue = (laptop, field) => {
    const value = laptop[field];

    switch (field) {
        case "price":
            return `$${value.toLocaleString()}`;
        case "ramGB":
        case "storageGB":
            return `${value} GB`;
        case "batteryHours":
            return `${value} hours`;
        case "weightKg":
            return `${value} kg`;
        case "screenInches":
            return `${value} inches`;
        default:
            return value;
    }
};
