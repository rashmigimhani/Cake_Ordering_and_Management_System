import React, { useState } from "react";
import { CreditCard, Lock, Calendar, User } from "lucide-react";

const CardPayment = ({ onPay, loading = false, amount }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [errors, setErrors] = useState({});

  const validateCardNumber = (cardNumber) => {
    // Remove spaces and check if it's a valid card number
    const cleaned = cardNumber.replace(/\s/g, "");
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardRegex = /^5[1-5][0-9]{14}$/;
    
    if (!cleaned) return "Card number is required";
    if (cleaned.length < 13 || cleaned.length > 19) return "Invalid card number length";
    if (!visaRegex.test(cleaned) && !mastercardRegex.test(cleaned)) {
      return "Please enter a valid Visa or Mastercard number";
    }
    return null;
  };

  const validateExpiryDate = (expiryDate) => {
    if (!expiryDate) return "Expiry date is required";
    
    const [month, year] = expiryDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (!month || !year) return "Invalid date format";
    if (month < 1 || month > 12) return "Invalid month";
    if (year < currentYear || (year == currentYear && month < currentMonth)) {
      return "Card has expired";
    }
    return null;
  };

  const validateCVV = (cvv) => {
    if (!cvv) return "CVV is required";
    if (!/^\d{3,4}$/.test(cvv)) return "CVV must be 3 or 4 digits";
    return null;
  };

  const validateCardholderName = (name) => {
    if (!name.trim()) return "Cardholder name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return "Name can only contain letters and spaces";
    return null;
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    // Add spaces every 4 digits
    return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
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
    
    newErrors.cardNumber = validateCardNumber(formData.cardNumber);
    newErrors.expiryDate = validateExpiryDate(formData.expiryDate);
    newErrors.cvv = validateCVV(formData.cvv);
    newErrors.cardholderName = validateCardholderName(formData.cardholderName);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onPay({
        paymentMethod: "Card",
        cardDetails: {
          last4: formData.cardNumber.replace(/\s/g, "").slice(-4),
          expiryDate: formData.expiryDate,
          cardholderName: formData.cardholderName
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Card Payment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            <Lock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange("cardholderName", e.target.value)}
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardholderName ? "border-red-500" : "border-gray-300"
              }`}
            />
            <User className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          {errors.cardholderName && (
            <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.expiryDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            {errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              value={formData.cvv}
              onChange={(e) => handleInputChange("cvv", e.target.value)}
              placeholder="123"
              maxLength={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cvv ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cvv && (
              <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <Lock className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
            <p className="text-sm text-blue-800">
              Your payment information is secure and encrypted. We don't store your card details.
            </p>
          </div>
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay LKR ${amount}`
          )}
        </button>
      </form>
    </div>
  );
};

export default CardPayment;
