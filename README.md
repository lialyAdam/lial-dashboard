SupplySight Dashboard – Take-Home Assignment
Overview

This project is a Full Stack Inventory Dashboard built for the take-home assignment for the Full Stack Engineer position. It simulates an inventory management system where users can view stock levels, demand, fill rate, and manage inventory operations such as updating demand and transferring stock.

Features

Inventory Dashboard

Overview of total stock, total demand, and fill rate.

Graph showing stock vs demand for all products.

Filters by warehouse, product status, and search by name/SKU/ID.

Pagination for large datasets.

Product Management

Update product demand directly from a modal drawer.

Transfer stock from a product to simulate stock movement.

Product status indicators: Healthy, Low, Critical.

Real-time UI updates using React state.

Responsive Design

Fully responsive layout.

Sidebar navigation for Dashboard, Reports, and Settings.

Frontend

React + Tailwind CSS + Recharts for data visualization.

Framer Motion for smooth UI animations.

Lucide-react for icons.

Custom reusable components (Cards, Buttons).

Backend (Mock Server)

Mock data simulates a real backend using hardcoded products.

No real Apollo Server needed, the frontend works standalone.

Supports update demand and transfer stock mutations.

Tech Stack

Frontend: React, Tailwind CSS, Framer Motion, Recharts, Lucide-react

State Management: React useState, useMemo, useEffect

Data Handling: Mock data with in-memory state

How to Run

Clone the repository.

Install dependencies:

npm install


Start the app:

npm run dev


Open http://localhost:5173 in your browser.

Project Structure
src/
 ├─ App.jsx          # Main App component with dashboard and table
 ├─ assets/          # Static assets
 ├─ graphql.js       # (Optional) GraphQL queries/mutations (not used in mock)
 ├─ apolloClient.js  # (Optional) Apollo Client setup
 ├─ main.jsx         # App entry point
 └─ index.css        # Global styles
public/
 └─ index.html

Demo

A live demo video showcasing the project can be viewed here:
https://youtu.be/gdK9tM_TgQE

Notes

The project is designed to simulate a real inventory system while keeping the setup simple.

All operations (update demand, transfer stock) are handled in-memory with immediate UI feedback.

The dashboard is fully responsive and visually aligned with modern web application standards.
