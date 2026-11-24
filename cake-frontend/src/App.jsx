import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./app-components/Login";
import Register from "./app-components/Register";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import CreateOrderPage from "./pages/CreateOrderPage";
import HomePage from "./pages/HomePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyPaymentsPage from "./pages/MyPaymentsPage";
import CreatePaymentPage from "./pages/CreatePaymentPage";
import MyTickets from "./pages/MyTickets";
import "antd/dist/reset.css";
import AdminLogin from "./app-components/AdminLogin";
import AdminDashboard from "./app-components/AdminDashboard";
import CartPage from "./pages/CartPage";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavFooter =
    location.pathname === "/admin-login" ||
    location.pathname.startsWith("/admin-dashboard");

  if (hideNavFooter) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<CustomerProfilePage />} />
          <Route path="/create-order" element={<CreateOrderPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/payments" element={<MyPaymentsPage />} />
          <Route path="/create-payment" element={<CreatePaymentPage />} />
          <Route path="/tickets" element={<MyTickets />} />
          {/* ADMIN ROUTES */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
