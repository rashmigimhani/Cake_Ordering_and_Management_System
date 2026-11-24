# Cake Ordering and Management System

A Node.js + Express backend with MongoDB for a cake ordering and management system. This system follows a modular architecture structured into models, controllers, and routes for each core domain.

## Core Domains

- Customers
- Orders
- Ingredients (Inventory)
- Suppliers
- Deliveries
- Delivery Personnel
- Transactions

## Features

- Full CRUD operations for all entities
- Soft-delete functionality (deleted: true/false) instead of hard deletes
- Explicit relationships between entities
- RESTful API endpoints for each module
- Modular separation of business logic, data models, and route handling

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/cake-ordering-system
   ```
4. Start the server
   ```
   npm run dev
   ```

## API Endpoints

### Customers
- GET /api/customers - Get all customers
- GET /api/customers/:id - Get a single customer
- POST /api/customers - Create a new customer
- PUT /api/customers/:id - Update a customer
- DELETE /api/customers/:id - Soft delete a customer

### Orders
- GET /api/orders - Get all orders
- GET /api/orders/:id - Get a single order
- POST /api/orders - Create a new order
- PUT /api/orders/:id - Update an order
- DELETE /api/orders/:id - Soft delete an order

### Ingredients
- GET /api/ingredients - Get all ingredients
- GET /api/ingredients/:id - Get a single ingredient
- POST /api/ingredients - Create a new ingredient
- PUT /api/ingredients/:id - Update an ingredient
- DELETE /api/ingredients/:id - Soft delete an ingredient

### Suppliers
- GET /api/suppliers - Get all suppliers
- GET /api/suppliers/:id - Get a single supplier
- POST /api/suppliers - Create a new supplier
- PUT /api/suppliers/:id - Update a supplier
- DELETE /api/suppliers/:id - Soft delete a supplier

### Delivery Personnel
- GET /api/delivery-personnel - Get all delivery personnel
- GET /api/delivery-personnel/:id - Get a single delivery personnel
- POST /api/delivery-personnel - Create a new delivery personnel
- PUT /api/delivery-personnel/:id - Update a delivery personnel
- DELETE /api/delivery-personnel/:id - Soft delete a delivery personnel

### Deliveries
- GET /api/deliveries - Get all deliveries
- GET /api/deliveries/:id - Get a single delivery
- POST /api/deliveries - Create a new delivery
- PUT /api/deliveries/:id - Update a delivery
- DELETE /api/deliveries/:id - Soft delete a delivery

### Transactions
- GET /api/transactions - Get all transactions
- GET /api/transactions/:id - Get a single transaction
- POST /api/transactions - Create a new transaction
- PUT /api/transactions/:id - Update a transaction
- DELETE /api/transactions/:id - Soft delete a transaction