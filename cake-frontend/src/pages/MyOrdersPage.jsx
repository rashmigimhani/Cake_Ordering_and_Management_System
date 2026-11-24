import { orderApi } from "@/api/orderApi";
import React, { useEffect, useState } from "react";
import { Calendar, Package, MapPin, Clock, DollarSign } from "lucide-react";

const MyOrdersPage = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => { 
    try {
      let orders = await orderApi.getAllOrders();
      const currentUserId = localStorage.getItem("userId");
      orders = orders.filter((order) => order.customerId?._id == currentUserId);
      setMyOrders(orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your cake orders
          </p>
        </div>

        {myOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600">
              Start by ordering your first custom cake!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {order.cakeType.replace(/([A-Z])/g, " $1").trim()} Cake
                      </h3>
                      <p className="text-gray-600 capitalize mt-1">
                        {order.flavor} • {order.size} • {order.theme}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Event Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(order.eventDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Delivery</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.deliveryMethod}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Total Price</p>
                        <p className="text-sm font-medium text-gray-900">
                          LKR {order.totalPrice}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {order.deliveryAddress && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Delivery Address
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress.street},{" "}
                        {order.deliveryAddress.city}{" "}
                        {order.deliveryAddress.postalCode}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Order ID: #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>
                          Customer: {order.customerId.firstName}{" "}
                          {order.customerId.lastName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
