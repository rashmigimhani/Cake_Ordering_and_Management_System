import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cakeApi } from "@/api/cakeApi";
import { addToCart, getCartItemCount, isInCart, getItemQuantity } from "@/utils/cartUtils";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";

const HomePage = () => {
  const router = useNavigate();
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    fetchCakes();
    updateCartInfo();
  }, []);

  const updateCartInfo = () => {
    const count = getCartItemCount();
    setCartCount(count);
    
    // Update cart items state for each cake
    const items = {};
    cakes.forEach(cake => {
      items[cake._id] = {
        inCart: isInCart(cake._id),
        quantity: getItemQuantity(cake._id)
      };
    });
    setCartItems(items);
  };

  const fetchCakes = async () => {
    try {
      const data = await cakeApi.getAvailableCakes(); // Only show cakes that are in stock
      setCakes(data);
    } catch (error) {
      console.error("Failed to fetch cakes:", error);
      // Fallback to empty array if API fails
      setCakes([]);
    } finally {
      setLoading(false);
    }
  };

  // Update cart info when cakes are loaded
  useEffect(() => {
    if (cakes.length > 0) {
      updateCartInfo();
    }
  }, [cakes]);

  const handleAddToCart = (cake) => {
    addToCart(cake);
    updateCartInfo();
    
    // Show success feedback
    const button = document.getElementById(`add-to-cart-${cake._id}`);
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '<Check className="w-4 h-4" /> Added!';
      button.classList.add('bg-green-500', 'hover:bg-green-600');
      button.classList.remove('bg-pink-500', 'hover:bg-pink-600');
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('bg-green-500', 'hover:bg-green-600');
        button.classList.add('bg-pink-500', 'hover:bg-pink-600');
      }, 1500);
    }
  };

  const handleBuyNow = (cake) => {
    router(`/create-order?cakeId=${cake._id}`);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-pink-800 mb-4">
            Sweet Bliss Cakes
          </h1>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto">
            Handcrafted cakes made with love, delivered to your doorstep for
            every sweet occasion.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-pink-600 text-xl">Loading delicious cakes...</div>
          </div>
        ) : cakes.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-pink-600 text-xl mb-4">No cakes available at the moment</div>
              <div className="text-gray-600">Please check back later for our delicious cakes!</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cakes.map((cake) => (
              <div
                key={cake._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={cake.imageUrl || "https://via.placeholder.com/300x200/f0f0f0/999999?text=No+Image"}
                    alt={cake.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200/f0f0f0/999999?text=No+Image";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    LKR {cake.price.toFixed(2)}
                  </div>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Stock: {cake.inStockAmount}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {cake.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">{cake.description}</p>
                  
                  {/* Cart Status */}
                  {cartItems[cake._id]?.inCart && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700 font-medium">
                          <Check className="w-4 h-4 inline mr-1" />
                          In Cart ({cartItems[cake._id]?.quantity})
                        </span>
                        <span className="text-green-600">
                          LKR {(cake.price * cartItems[cake._id]?.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                        style={{color:"white"}}
                      onClick={() => handleBuyNow(cake)}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                    >
                      Buy Now
                    </button>
                    <button
                    style={{marginTop: "8px",color:"white"}}
                      id={`add-to-cart-${cake._id}`}
                      onClick={() => handleAddToCart(cake)}
                      className="mt-8 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
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

export default HomePage;
