import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  getCartTotal 
} from "@/utils/cartUtils";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  X
} from "lucide-react";

const CartDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = () => {
    const cart = getCart();
    const cartTotal = getCartTotal();
    setCartItems(cart);
    setTotal(cartTotal);
  };

  const handleQuantityChange = (cakeId, newQuantity) => {
    updateCartItemQuantity(cakeId, newQuantity);
    loadCart();
  };

  const handleRemoveItem = (cakeId) => {
    removeFromCart(cakeId);
    loadCart();
  };

  const handleBuyNow = (cake) => {
    navigate(`/create-order?cakeId=${cake._id}`);
    onClose();
  };

  const handleViewCart = () => {
    navigate('/cart');
    onClose();
  };

  const handleCheckout = () => {
    navigate('/checkout');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute right-4 top-16 w-96 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Shopping Cart</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="max-h-64 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item._id} className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Cake Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/60x60/f0f0f0/999999?text=No+Image"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/60x60/f0f0f0/999999?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Cake Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        LKR {item.price.toFixed(2)} each
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          disabled={item.quantity >= item.inStockAmount}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end space-y-1">
                      <div className="text-sm font-bold text-gray-800">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleBuyNow(item)}
                          className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded transition-colors"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-xs text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-pink-600">
                LKR {total.toFixed(2)}
              </span>
            </div>
            <div className="flex space-x-2">
            
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
