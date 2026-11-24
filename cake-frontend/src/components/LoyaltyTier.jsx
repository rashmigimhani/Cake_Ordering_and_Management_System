import React from "react";
import { Crown, Star, Award } from "lucide-react";

const LoyaltyTier = ({ loyaltyPoints = 0 }) => {
  const getTierInfo = (points) => {
    if (points <= 20) {
      return {
        tier: "Silver",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        borderColor: "border-gray-300",
        icon: Star,
        iconColor: "text-gray-500",
        description: "New member - Start earning points!",
        benefits: ["Basic customer support", "Standard delivery"],
        nextTier: "Gold",
        pointsNeeded: 21 - points,
      };
    } else if (points <= 100) {
      return {
        tier: "Gold",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-300",
        icon: Crown,
        iconColor: "text-yellow-500",
        description: "Loyal customer - Great progress!",
        benefits: ["Priority support", "Free delivery", "5% discount"],
        nextTier: "Platinum",
        pointsNeeded: 101 - points,
      };
    } else {
      return {
        tier: "Platinum",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-300",
        icon: Award,
        iconColor: "text-purple-500",
        description: "VIP member - Top tier achieved!",
        benefits: ["VIP support", "Free delivery", "10% discount", "Exclusive offers"],
        nextTier: null,
        pointsNeeded: 0,
      };
    }
  };

  const tierInfo = getTierInfo(loyaltyPoints);
  const IconComponent = tierInfo.icon;

  return (
    <div className={`${tierInfo.bgColor} ${tierInfo.borderColor} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${tierInfo.bgColor}`}>
            <IconComponent className={`w-6 h-6 ${tierInfo.iconColor}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${tierInfo.color}`}>
              {tierInfo.tier} Member
            </h3>
            <p className="text-sm text-gray-600">{tierInfo.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Points</p>
          <p className={`text-2xl font-bold ${tierInfo.color}`}>
            {loyaltyPoints}
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Benefits:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {tierInfo.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Progress to next tier */}
      {tierInfo.nextTier && (
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress to {tierInfo.nextTier}
            </span>
            <span className="text-sm text-gray-500">
              {tierInfo.pointsNeeded} points needed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                tierInfo.tier === "Silver" ? "bg-yellow-400" : "bg-purple-400"
              }`}
              style={{
                width: `${Math.min(
                  ((loyaltyPoints - (tierInfo.tier === "Silver" ? 0 : 20)) /
                    (tierInfo.tier === "Silver" ? 21 : 81)) *
                    100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Platinum achievement message */}
      {tierInfo.tier === "Platinum" && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center">
            <Award className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-800">
              🎉 Congratulations! You've reached the highest tier!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyTier;
