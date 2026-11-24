import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart, 
  getCartTotal 
} from "@/utils/cartUtils";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  CheckCircle 
} from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = getCart();
    const cartTotal = getCartTotal();
    setCartItems(cart);
    setTotal(cartTotal);
    setLoading(false);
  };

  const handleQuantityChange = (cakeId, newQuantity) => {
    updateCartItemQuantity(cakeId, newQuantity);
    loadCart();
  };

  const handleRemoveItem = (cakeId) => {
    removeFromCart(cakeId);
    loadCart();
  };

  const handleClearCart = () => {
    clearCart();
    loadCart();
  };

  const handleCheckout = () => {
    // Navigate to checkout page or create order for all items
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white shadow-sm rounded-lg mb-8">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => navigate('/')}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious cakes to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/')}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
                <span className="ml-4 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 font-medium flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Cart Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Cake Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.imageUrl || "https://via.placeholder.com/100x100/f0f0f0/999999?text=No+Image"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100x100/f0f0f0/999999?text=No+Image";
                          }}
                        />
                      </div>

                      {/* Cake Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-lg font-bold text-pink-600">
                            LKR {item.price.toFixed(2)}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">each</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={item.quantity >= item.inStockAmount}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1 flex items-center"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cartItems.length})</span>
                  <span className="font-medium">LKR {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">TBD</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-pink-600">LKR {total.toFixed(2)}</span>
                </div>
              </div>

             

              <button
                onClick={() => navigate('/')}
                className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
