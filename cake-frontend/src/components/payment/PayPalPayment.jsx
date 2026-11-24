import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";

const PayPalPayment = ({ onPay, loading = false, amount }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onPay({
        paymentMethod: "PayPal",
        paypalDetails: {
          email: formData.email,
          rememberMe: formData.rememberMe
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-blue-800 rounded text-white flex items-center justify-center text-sm font-bold mr-3">
          PP
        </div>
        <h3 className="text-lg font-semibold text-gray-900">PayPal Payment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PayPal Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="your.email@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PayPal Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter your PayPal password"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <Lock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            Remember me for future payments
          </label>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <Lock className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                Secure PayPal Login
              </p>
              <p className="text-sm text-blue-800">
                You'll be redirected to PayPal's secure login page to complete your payment.
              </p>
            </div>
          </div>
        </div>

        {/* PayPal Benefits */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">PayPal Benefits:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Buyer protection on eligible purchases</li>
            <li>• No need to share your card details</li>
            <li>• Fast and secure checkout</li>
            <li>• Available in multiple currencies</li>
          </ul>
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-800 hover:bg-blue-900"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay with PayPal - LKR ${amount}`
          )}
        </button>
      </form>
    </div>
  );
};

export default PayPalPayment;
