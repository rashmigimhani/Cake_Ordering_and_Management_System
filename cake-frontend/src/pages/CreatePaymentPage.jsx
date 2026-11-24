import React, { useState, useEffect } from "react";
import { paymentApi } from "@/api/paymentApi";
import { orderApi } from "@/api/orderApi";
import { customerApi } from "@/api/customerApi";
import { CreditCard, CheckCircle, AlertCircle, Percent } from "lucide-react";
import CardPayment from "@/components/payment/CardPayment";
import PayPalPayment from "@/components/payment/PayPalPayment";

const CreatePaymentPage = () => {
  const [orderId, setOrderId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "",
    amount: 0,
    currency: "LKR",
    paymentStatus: "Pending",
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");
  const [discountInfo, setDiscountInfo] = useState({
    tier: "Silver",
    discountPercentage: 0,
    discountAmount: 0,
    finalAmount: 0,
  });

  // Calculate discount based on loyalty points
  const calculateDiscount = (loyaltyPoints, originalAmount) => {
    let tier = "Silver";
    let discountPercentage = 0;

    if (loyaltyPoints <= 20) {
      tier = "Silver";
      discountPercentage = 0;
    } else if (loyaltyPoints <= 100) {
      tier = "Gold";
      discountPercentage = 5;
    } else {
      tier = "Platinum";
      discountPercentage = 10;
    }

    const discountAmount = (originalAmount * discountPercentage) / 100;
    const finalAmount = originalAmount - discountAmount;

    return {
      tier,
      discountPercentage,
      discountAmount,
      finalAmount,
    };
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = urlParams.get("orderId");
    const customerIdFromStorage = localStorage.getItem("userId");

    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
    }
    if (customerIdFromStorage) {
      setCustomerId(customerIdFromStorage);
    }

    if (orderIdFromUrl) {
      fetchOrder(orderIdFromUrl);
    }
    if (customerIdFromStorage) {
      fetchCustomer(customerIdFromStorage);
    }
  }, []);

  // Recalculate discount when customer data is loaded
  useEffect(() => {
    if (customer && order) {
      const discount = calculateDiscount(customer.loyaltyPoints || 0, order.totalPrice);
      setDiscountInfo(discount);
      setPaymentData((prev) => ({
        ...prev,
        amount: discount.finalAmount,
      }));
    }
  }, [customer, order]);

  const fetchCustomer = async (id) => {
    try {
      const customerData = await customerApi.getCustomerById(id);
      setCustomer(customerData);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch customer details");
    }
  };

  const fetchOrder = async (id) => {
    try {
      const orderData = await orderApi.getOrderById(id);
      setOrder(orderData);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handlePayment = async (paymentDetails) => {
    setPaymentLoading(true);
    setError("");

    try {
      const transactionData = {
        orderId: orderId,
        customerId: customerId,
        paymentMethod: paymentDetails.paymentMethod,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentStatus: "Pending",
        paymentDetails: paymentDetails,
      };

      await paymentApi.createTransaction(transactionData);
      setPaymentSuccess(true);
    } catch (error) {
      console.error(error);
      setError("Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
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

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Order ID: #{orderId.slice(-8).toUpperCase()}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Amount Paid: LKR {paymentData.amount}
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/orders")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600">
            The order you're trying to pay for could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Complete Payment
            </h1>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">
                    #{orderId.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Cake Type:</span>
                  <span className="font-medium capitalize">
                    {order.cakeType} Cake
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Flavor:</span>
                  <span className="font-medium capitalize">{order.flavor}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium capitalize">{order.size}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Theme:</span>
                  <span className="font-medium capitalize">{order.theme}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Delivery Method:</span>
                  <span className="font-medium">{order.deliveryMethod}</span>
                </div>
                <hr className="my-3" />
                
                {/* Original Total */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Original Total:</span>
                  <span className="font-medium">LKR {order.totalPrice}</span>
                </div>
                
                {/* Discount Information */}
                {discountInfo.discountPercentage > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 flex items-center">
                        <Percent className="w-4 h-4 mr-1" />
                        {discountInfo.tier} Member Discount ({discountInfo.discountPercentage}%):
                      </span>
                      <span className="font-medium text-green-600">
                        -LKR {discountInfo.discountAmount.toFixed(2)}
                      </span>
                    </div>
                    <hr className="my-3" />
                  </>
                )}
                
                {/* Final Amount */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {discountInfo.discountPercentage > 0 ? "Final Amount:" : "Total Amount:"}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    LKR {discountInfo.finalAmount.toFixed(2)}
                  </span>
                </div>
                
                {/* Loyalty Tier Info */}
                {customer && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">
                        <strong>{discountInfo.tier} Member</strong> - {customer.loyaltyPoints || 0} points
                      </span>
                      {discountInfo.discountPercentage > 0 && (
                        <span className="text-sm text-green-600 font-medium">
                          You saved LKR {discountInfo.discountAmount.toFixed(2)}!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => handlePaymentMethodChange("Card")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentData.paymentMethod === "Card"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-bold mb-2">
                        VISA
                      </div>
                      <span className="text-sm font-medium">Visa / MasterCard</span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handlePaymentMethodChange("PayPal")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentData.paymentMethod === "PayPal"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-8 bg-blue-800 rounded text-white flex items-center justify-center text-xs font-bold mb-2">
                        PP
                      </div>
                      <span className="text-sm font-medium">PayPal</span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handlePaymentMethodChange("Cash")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentData.paymentMethod === "Cash"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-8 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold mb-2">
                        CASH
                      </div>
                      <span className="text-sm font-medium">Cash Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            {paymentData.paymentMethod === "Card" && (
              <div className="mb-8">
                <CardPayment
                  onPay={handlePayment}
                  loading={paymentLoading}
                  amount={paymentData.amount}
                />
              </div>
            )}

            {paymentData.paymentMethod === "PayPal" && (
              <div className="mb-8">
                <PayPalPayment
                  onPay={handlePayment}
                  loading={paymentLoading}
                  amount={paymentData.amount}
                />
              </div>
            )}

            {paymentData.paymentMethod === "Cash" && (
              <div className="mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-green-600 rounded text-white flex items-center justify-center text-sm font-bold mr-3">
                      CASH
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Cash Payment</h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Instructions:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Pay in cash when you receive your order</li>
                      <li>• Have exact change ready for faster service</li>
                      <li>• Payment is due upon delivery/pickup</li>
                      <li>• No additional fees for cash payments</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                    <div className="flex items-start">
                      <div className="w-4 h-4 text-green-600 mt-0.5 mr-2">✓</div>
                      <p className="text-sm text-green-800">
                        Your order will be confirmed immediately. You can pay with cash when you receive your cake.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePayment({ paymentMethod: "Cash" })}
                    disabled={paymentLoading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                      paymentLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {paymentLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Confirm Cash Payment - LKR ${paymentData.amount}`
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePaymentPage;

