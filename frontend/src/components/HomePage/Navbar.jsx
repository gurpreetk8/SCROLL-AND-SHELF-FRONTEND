import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BookOpen, X, Menu, ChevronDown, ArrowRight } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Ebooks", path: "/ebooks" },
    { name: "Categories", path: "/categories" },
    { name: "Popular", path: "/popular" },
    { name: "Request a Book", path: "/request" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const userString = localStorage.getItem("user");
      const userObj = JSON.parse(userString);
      setUser(userObj);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTimeout(() => (window.location.href = "/"), 2000);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white backdrop-blur-md border-b border-gray-100 fixed w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2"
          >
            <BookOpen className="h-8 w-8 stroke-[1.5] text-gray-900" />
            <span className="text-2xl font-medium tracking-tight text-gray-900">
              Scroll<span className="font-light">&</span>Shelf
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="relative text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  {link.name}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-px bg-gray-900 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </Link>
            ))}

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-sm hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm">Hi, {user?.first_name}</span>
                  <ChevronDown className="h-4 w-4 stroke-[1.5]" />
                </button>

                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-xl border border-gray-100"
                  >
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link to="/login-register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-sm hover:bg-gray-800 transition-colors flex items-center space-x-2 text-sm"
                >
                  <ArrowRight className="h-4 w-4 stroke-[1.5]" />
                  <span>Get Started</span>
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-sm text-gray-600 hover:bg-gray-50"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="block px-3 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {link.name}
                </motion.div>
              </Link>
            ))}
            {isLoggedIn ? (
              <div className="space-y-2 mt-2">
                <Link to="/dashboard">
                  <button className="w-full bg-gray-900 text-white px-5 py-2.5 rounded-sm hover:bg-gray-800">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="w-full bg-gray-900 text-white px-5 py-2.5 rounded-sm hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login-register">
                <button className="w-full bg-gray-900 text-white px-5 py-2.5 rounded-sm hover:bg-gray-800 flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>Get Started</span>
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;