import { paymentApi } from "@/api/paymentApi";
import { useEffect, useState } from "react";
import {
  CreditCard,
  Calendar,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";

const MyPaymentsPage = () => {
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPayments = async () => {
    try {
      let payments = await paymentApi.getAllTransactions();
      const currentUserId = localStorage.getItem("userId");
      payments = payments.filter(
        (payment) => payment.customerId._id == currentUserId
      );
      setMyPayments(payments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPayments();
  }, []);

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Visa":
        return (
          <div className="w-8 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
            VISA
          </div>
        );
      case "MasterCard":
        return (
          <div className="w-8 h-6 bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold">
            MC
          </div>
        );
      case "PayPal":
        return (
          <div className="w-8 h-6 bg-blue-800 rounded text-white flex items-center justify-center text-xs font-bold">
            PP
          </div>
        );
      case "Cash":
        return (
          <div className="w-8 h-6 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold">
            CASH
          </div>
        );
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
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
          <h1 className="text-3xl font-bold text-gray-900">My Payments</h1>
          <p className="text-gray-600 mt-2">
            View your payment history and transaction details
          </p>
        </div>

        {myPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No payments yet
            </h3>
            <p className="text-gray-600">
              Your payment history will appear here once you make your first
              purchase.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {myPayments.map((payment) => (
              <div
                key={payment._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="ml-3 text-lg font-semibold text-gray-900">
                          {payment.paymentMethod} Payment
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Transaction for order #
                        {payment.orderId._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          payment.paymentStatus
                        )} mb-2`}
                      >
                        {payment.paymentStatus === "Completed" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {payment.paymentStatus === "Pending" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {payment.paymentStatus}
                      </span>
                      <p className="text-xl font-bold text-gray-900">
                        {payment.currency} {payment.amount}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Cake Details</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {payment.orderId.cakeType} - {payment.orderId.flavor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Size & Theme</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {payment.orderId.size} - {payment.orderId.theme}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Event Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(payment.orderId.eventDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Order Status:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {payment.orderId.orderStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Delivery Method:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {payment.orderId.deliveryMethod}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Order Total:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {payment.currency} {payment.orderId.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Payment ID: #{payment._id.slice(-8).toUpperCase()}
                      </span>
                      <span>Paid on {formatDate(payment.createdAt)}</span>
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

export default MyPaymentsPage;
