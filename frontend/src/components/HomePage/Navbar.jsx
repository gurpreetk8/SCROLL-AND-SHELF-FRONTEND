import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BookOpen, X, Menu, ChevronDown, ArrowRight, Search } from "lucide-react";
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
    { name: "Community", path: "/community" },
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
      if (error.response) {
        toast.error(`Search failed: ${error.response.statusText}`);
      } else if (error.request) {
        toast.error("Network error - please check your connection");
      } else {
        toast.error("Error in search request");
      }
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSearchResults && !e.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

            {/* Search Bar */}
            <div className="relative search-container">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search books..."
                  className="border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="ml-2 p-2 text-gray-600 hover:text-gray-900"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-sm shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50"
                >
                  <div className="p-2">
                    <div className="flex justify-between items-center px-2 py-1 border-b border-gray-100">
                      <h3 className="text-sm font-medium">
                        {searchResults.length > 0 
                          ? `Found ${searchResults.length} ${searchResults.length === 1 ? 'book' : 'books'}`
                          : "No books found"}
                      </h3>
                      <button
                        onClick={closeSearchResults}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {searchResults.map((book) => (
                          <Link
                            key={book.id}
                            to={`/ebook-detail?id=${ebookId}`}
                            onClick={closeSearchResults}
                            className="block px-3 py-3 hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              {book.cover_image && (
                                <img
                                  src={book.cover_image}
                                  alt={book.title}
                                  className="h-12 w-9 object-cover rounded-sm"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-book-cover.jpg';
                                  }}
                                />
                              )}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {book.title}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {book.author}
                                </p>
                                {book.category && (
                                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 rounded-sm">
                                    {book.category.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-4 text-center text-sm text-gray-500">
                        No books found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

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

            {/* Mobile Search */}
            <div className="px-3 py-2 search-container">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search books..."
                  className="border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 flex-grow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="ml-2 p-2 text-gray-600 hover:text-gray-900"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </form>
            </div>

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