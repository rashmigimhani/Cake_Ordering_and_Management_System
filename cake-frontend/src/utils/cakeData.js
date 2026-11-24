// Base prices and configurations for cake ordering
export const cakeData = {
  basePrices: {
    normal: 500,
    vanilla: 100, // Additional cost
    chocolate: 250, // Additional cost
    strawberry: 150,
    redVelvet: 200,
    lemon: 120,
    carrot: 180,
  },

  sizeMultipliers: {
    small: 0.7,
    medium: 1.0,
    large: 1.5,
    extraLarge: 2.0,
  },

  themeMultipliers: {
    birthday: 1.0,
    wedding: 1.8,
    anniversary: 1.3,
    graduation: 1.2,
    corporate: 1.4,
    baby_shower: 1.3,
    valentine: 1.4,
    christmas: 1.5,
    custom: 2.0,
  },

  cakeTypes: [
    {
      id: "vanilla",
      name: "Vanilla Cake",
      description: "Classic vanilla sponge with rich vanilla flavor",
      basePrice: 600,
      image:
        "https://flouringkitchen.com/wp-content/uploads/2023/07/BW1A4089-2.jpg",
      flavors: ["vanilla bean", "french vanilla", "vanilla buttercream"],
    },
    {
      id: "chocolate",
      name: "Chocolate Cake",
      description: "Rich and moist chocolate cake with cocoa",
      basePrice: 750,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsAogZTbezIjVv1Bujg92UjLJM_y6dCZkrAw&s",
      flavors: ["dark chocolate", "milk chocolate", "chocolate fudge"],
    },
    {
      id: "strawberry",
      name: "Strawberry Cake",
      description: "Fresh strawberry cake with natural strawberry flavor",
      basePrice: 650,
      image:
        "https://ocakes.in/storage/app/public/images/item/item-642f5ad0783b8.jpg",
      flavors: ["fresh strawberry", "strawberry cream", "strawberry vanilla"],
    },
    {
      id: "funfetti",
      name: "Funfetti Cake",
      description: "Colorful celebration cake with rainbow sprinkles",
      basePrice: 680,
      image:
        "https://ichef.bbc.co.uk/ace/standard/1600/food/recipes/funfetti_cake_49993_16x9.jpg.webp",
      flavors: ["rainbow vanilla", "birthday cake", "confetti vanilla"],
    },
  ],

  sizes: [
    {
      id: "small",
      name: "Small (6 inch)",
      description: "Serves 6-8 people",
      multiplier: 0.7,
    },
    {
      id: "medium",
      name: "Medium (8 inch)",
      description: "Serves 10-12 people",
      multiplier: 1.0,
    },
    {
      id: "large",
      name: "Large (10 inch)",
      description: "Serves 15-20 people",
      multiplier: 1.5,
    },
    {
      id: "extraLarge",
      name: "Extra Large (12 inch)",
      description: "Serves 25-30 people",
      multiplier: 2.0,
    },
  ],

  themes: [
    {
      id: "birthday",
      name: "Birthday",
      description: "Perfect for birthday celebrations",
      multiplier: 1.0,
      additionalCost: 0,
    },
    {
      id: "wedding",
      name: "Wedding",
      description: "Elegant design for your special day",
      multiplier: 1.8,
      additionalCost: 500,
    },
    {
      id: "anniversary",
      name: "Anniversary",
      description: "Romantic design for anniversaries",
      multiplier: 1.3,
      additionalCost: 200,
    },
    {
      id: "graduation",
      name: "Graduation",
      description: "Celebrate academic achievements",
      multiplier: 1.2,
      additionalCost: 150,
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Professional design for business events",
      multiplier: 1.4,
      additionalCost: 300,
    },
    {
      id: "baby_shower",
      name: "Baby Shower",
      description: "Sweet design for welcoming babies",
      multiplier: 1.3,
      additionalCost: 200,
    },
    {
      id: "valentine",
      name: "Valentine",
      description: "Romantic design for love celebrations",
      multiplier: 1.4,
      additionalCost: 250,
    },
    {
      id: "christmas",
      name: "Christmas",
      description: "Festive holiday design",
      multiplier: 1.5,
      additionalCost: 350,
    },
    {
      id: "custom",
      name: "Custom Design",
      description: "Your unique design brought to life",
      multiplier: 2.0,
      additionalCost: 800,
    },
  ],

  deliveryMethods: [
    {
      id: "pickup",
      name: "Store Pickup",
      description: "Pick up from our store",
      cost: 0,
    },
    {
      id: "delivery",
      name: "Home Delivery",
      description: "Delivered to your doorstep",
      cost: 200,
    },
  ],
};

// Price calculation function
export const calculatePrice = (
  cakeType,
  size,
  theme,
  deliveryMethod = "pickup"
) => {
  // Get base price for cake type
  const selectedCakeType = cakeData.cakeTypes.find(
    (cake) => cake.id === cakeType
  );
  const basePrice = selectedCakeType
    ? selectedCakeType.basePrice
    : cakeData.basePrices.normal;

  // Get size multiplier
  const selectedSize = cakeData.sizes.find((s) => s.id === size);
  const sizeMultiplier = selectedSize ? selectedSize.multiplier : 1.0;

  // Get theme multiplier and additional cost
  const selectedTheme = cakeData.themes.find((t) => t.id === theme);
  const themeMultiplier = selectedTheme ? selectedTheme.multiplier : 1.0;
  const themeAdditionalCost = selectedTheme ? selectedTheme.additionalCost : 0;

  // Get delivery cost
  const selectedDelivery = cakeData.deliveryMethods.find(
    (d) => d.id === deliveryMethod
  );
  const deliveryCost = selectedDelivery ? selectedDelivery.cost : 0;

  // Calculate final price
  const cakePrice =
    basePrice * sizeMultiplier * themeMultiplier + themeAdditionalCost;
  const totalPrice = cakePrice + deliveryCost;

  return {
    basePrice,
    sizeMultiplier,
    themeMultiplier,
    themeAdditionalCost,
    deliveryCost,
    cakePrice: Math.round(cakePrice),
    totalPrice: Math.round(totalPrice),
  };
};

// Get available flavors for a cake type
export const getFlavorsForCakeType = (cakeTypeId) => {
  const cakeType = cakeData.cakeTypes.find((cake) => cake.id === cakeTypeId);
  return cakeType ? cakeType.flavors : [];
};

// Validation function for order data
export const validateOrderData = (orderData) => {
  const errors = {};

  if (!orderData.cakeType) {
    errors.cakeType = "Please select a cake type";
  }

  if (!orderData.flavor) {
    errors.flavor = "Please select a flavor";
  }

  if (!orderData.size) {
    errors.size = "Please select a size";
  }

  if (!orderData.theme) {
    errors.theme = "Please select a theme";
  }

  if (!orderData.eventDate) {
    errors.eventDate = "Please select an event date";
  } else {
    const eventDate = new Date(orderData.eventDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (eventDate < tomorrow) {
      errors.eventDate = "Event date must be at least 24 hours from now";
    }
  }

  if (!orderData.deliveryMethod) {
    errors.deliveryMethod = "Please select a delivery method";
  }

  // If delivery is selected, validate delivery address
  if (orderData.deliveryMethod === "delivery") {
    if (!orderData.deliveryAddress?.street) {
      errors.deliveryStreet = "Street address is required for delivery";
    }
    if (!orderData.deliveryAddress?.city) {
      errors.deliveryCity = "City is required for delivery";
    }
    if (!orderData.deliveryAddress?.postalCode) {
      errors.deliveryPostalCode = "Postal code is required for delivery";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default cakeData;
