import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  ShoppingBag,
  Ticket,
  CreditCard,
  LogIn,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import CartDropdown from "@/components/CartDropdown";
import { getCartItemCount } from "@/utils/cartUtils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    const count = getCartItemCount();
    setCartCount(count);
  };

  // Listen for cart changes
  useEffect(() => {
    const handleStorageChange = () => {
      updateCartCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom cart update events
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={"/"}>
              <h1 className="text-2xl font-bold text-pink-600">
                Sweet Bliss Cakes
              </h1>
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {userId ? (
                <>
                  <a
                    href="/profile"
                    className="flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Profile
                  </a>
                  <a
                    href="/orders"
                    className="flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium"
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    My Orders
                  </a>
                  <a
                    href="/tickets"
                    className="flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium"
                  >
                    <Ticket className="w-4 h-4 mr-1" />
                    My Tickets
                  </a>
                  <a
                    href="/payments"
                    className="flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    My Payments
                  </a>
                </>
              ) : (
                <a
                  href="/login"
                  className="flex items-center bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </a>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-pink-600 p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
            <a
              href="/"
              className="block text-gray-700 hover:text-pink-600 px-3 py-2 text-base font-medium"
            >
              Home
            </a>

            {/* Cart Button for Mobile */}
            <button
              onClick={() => {
                setIsCartOpen(!isCartOpen);
                setIsOpen(false);
              }}
              className="w-full flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-base font-medium"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {userId ? (
              <div className="border-t border-gray-200 pt-4">
                <a
                  href="/profile"
                  className="flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-base font-medium"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </a>
                <a
                  href="/orders"
                  className="flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-base font-medium"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  My Orders
                </a>
                <a
                  href="/tickets"
                  className="flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-base font-medium"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  My Tickets
                </a>
                <a
                  href="/payments"
                  className="flex items-center text-gray-700 hover:text-pink-600 px-3 py-2 text-base font-medium"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  My Payments
                </a>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4">
                <a
                  href="/login"
                  className="flex items-center bg-pink-600 text-white px-3 py-2 mx-3 rounded-md text-base font-medium hover:bg-pink-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Dropdown */}
      <CartDropdown 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
