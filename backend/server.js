const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
require("dotenv").config();

// Import routes
const customerRoutes = require("./src/routes/customer.routes");
const orderRoutes = require("./src/routes/order.routes");
const ingredientRoutes = require("./src/routes/ingredient.routes");
const supplierRoutes = require("./src/routes/supplier.routes");
const deliveryPersonnelRoutes = require("./src/routes/deliveryPersonnel.routes");
const deliveryRoutes = require("./src/routes/delivery.routes");
const transactionRoutes = require("./src/routes/transaction.routes");
const supportTicketRoutes = require("./src/routes/support.ticket.routes");
const cakeRoutes = require("./src/routes/cake.routes");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/delivery-personnel", deliveryPersonnelRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/tickets", supportTicketRoutes);
app.use("/api/cakes", cakeRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Cake Ordering and Management System API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
