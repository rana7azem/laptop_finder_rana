
# Student Laptop Finder

SW302 Assignment 2 - JavaScript & Tailwind CSS

## Project Description

Student Laptop Finder is a responsive web application that helps students browse laptops, search and filter them, save favorites, and compare selected laptops side by side.

## Technologies Used

- HTML5
- JavaScript (ES Modules)
- Tailwind CSS 4
- JSON
- localStorage

## Website Pages

- `index.html` - Home page with live statistics.
- `laptops.html` - Laptop catalogue with search, filters, and sorting.
- `details.html` - Individual laptop information and specifications.
- `favorites.html` - Saved laptops with total and average prices.
- `compare.html` - Side-by-side laptop comparison.

## Features

- 20 laptops loaded dynamically from a JSON file.
- Live search by laptop name or brand.
- Category, maximum price, and minimum RAM filters.
- Sorting by price, battery life, and weight.
- Add and remove favorites using localStorage.
- Compare 2 to 4 saved laptops.
- Automatic highlighting of the best specification values.
- Performance Mode and Battery Saver Mode.
- Responsive navigation and layout.
- Loading skeletons and error messages.

## Installation

1. Clone the repository:

   git clone https://github.com/rana7azem/laptop_finder_rana.git

2. Open the project folder:

   cd laptop_finder_rana

3. Install dependencies:

   npm install

4. Start Tailwind CSS in watch mode:

   npm run dev

5. Open `index.html` using VS Code Live Server.

## Production Build

To generate the minified Tailwind CSS file:

npm run build

The generated file is located at `dist/output.css`.

## Notes

- Open the website using a local server, not directly with `file://`.
- Laptop data is stored in `data/laptops.json`.
- Favorites and theme settings are saved in localStorage.
- Laptop names, specifications, and prices are sample data for demonstration.

## GitHub Repository

https://github.com/rana7azem/laptop_finder_rana

## Course

SW302 - User Interface Development

Assignment 2 - Student Laptop Finder Web App
