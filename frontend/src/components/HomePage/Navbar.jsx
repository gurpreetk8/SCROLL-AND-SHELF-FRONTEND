import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  BookOpen,
  X,
  Menu,
  ChevronDown,
  ArrowRight,
  Search
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com";

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Ebooks", path: "/ebooks" },
    { name: "Categories", path: "/categories" },
    { name: "Community", path: "/community" }
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
      draggable: true
    });
    setTimeout(() => (window.location.href = "/"), 2000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/ebooks/book_search/?title=${encodeURIComponent(searchQuery)}`,
        {
          headers: token ? { Authorization: `Token ${token}` } : {}
        }
      );

      setSearchResults(response.data.results || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search ebooks.");
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleResultClick = (ebookId) => {
    navigate(`/ebook-detail?id=${ebookId}`);
    closeSearchResults();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSearchResults && !e.target.closest(".search-container")) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchResults]);

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
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold text-amber-600"
          >
            <Link to="/">Scroll&Shelf</Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="relative hidden md:flex items-center search-container"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="absolute right-2 text-gray-500 hover:text-amber-600"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-10 left-0 w-64 bg-white shadow-lg border border-gray-200 rounded-md z-50">
                <ul>
                  {searchResults.map((result) => (
                    <li
                      key={result.id}
                      onClick={() => handleResultClick(result.id)}
                      className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm text-gray-700"
                    >
                      {result.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>

          {/* Right side: Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 text-sm">Hi, {user?.username}</span>
                <button
                  onClick={logout}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-white bg-amber-600 px-3 py-1 rounded-full hover:bg-amber-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-4 pb-2 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block text-gray-700 hover:text-amber-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="block w-full text-left text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-amber-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-white bg-amber-600 px-3 py-1 rounded-full hover:bg-amber-700 mt-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
