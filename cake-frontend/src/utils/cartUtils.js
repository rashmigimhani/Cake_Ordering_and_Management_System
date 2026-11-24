// Cart utility functions for localStorage management

const CART_KEY = 'sweetBlissCart';

// Dispatch cart update event
const dispatchCartUpdate = () => {
  window.dispatchEvent(new CustomEvent('cartUpdated'));
};

// Get cart from localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart from localStorage:', error);
    return [];
  }
};

// Save cart to localStorage
export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    dispatchCartUpdate();
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Add item to cart
export const addToCart = (cake) => {
  const cart = getCart();
  const existingItem = cart.find(item => item._id === cake._id);
  
  if (existingItem) {
    // If item already exists, increase quantity
    existingItem.quantity += 1;
  } else {
    // If item doesn't exist, add it with quantity 1
    cart.push({
      ...cake,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
  }
  
  saveCart(cart);
  return cart;
};

// Remove item from cart
export const removeFromCart = (cakeId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item._id !== cakeId);
  saveCart(updatedCart);
  return updatedCart;
};

// Update item quantity in cart
export const updateCartItemQuantity = (cakeId, quantity) => {
  const cart = getCart();
  const item = cart.find(item => item._id === cakeId);
  
  if (item) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      return removeFromCart(cakeId);
    } else {
      item.quantity = quantity;
    }
  }
  
  saveCart(cart);
  return cart;
};

// Get cart item count
export const getCartItemCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Get cart total price
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Clear entire cart
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  return [];
};

// Check if item is in cart
export const isInCart = (cakeId) => {
  const cart = getCart();
  return cart.some(item => item._id === cakeId);
};

// Get item quantity in cart
export const getItemQuantity = (cakeId) => {
  const cart = getCart();
  const item = cart.find(item => item._id === cakeId);
  return item ? item.quantity : 0;
};
