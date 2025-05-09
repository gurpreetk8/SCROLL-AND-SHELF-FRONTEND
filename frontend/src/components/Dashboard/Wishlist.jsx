import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiTrash2, FiClock } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  
  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/ebooks/";
  const token = localStorage.getItem("token");

  const handleBookClick = (ebookId) => {
    navigate(`/ebook-detail?id=${ebookId}`);
  };

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await axios.post(
        `${API_BASE_URL}get_wishlist/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setWishlist(response.data.wishlist);
      } else {
        setError(response.data.message || "Failed to fetch wishlist");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (ebookId, e) => {
    e.stopPropagation(); // Prevent triggering the book click
    if (!window.confirm("Are you sure you want to remove this from your wishlist?")) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${API_BASE_URL}remove_from_wishlist/`,
        { ebook_id: ebookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setWishlist(wishlist.filter(item => item.id !== ebookId));
        setSuccessMessage(response.data.message || "Removed from wishlist");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.data.message || "Failed to remove item");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (err) => {
    console.error("API Error:", err);
    
    if (err.response) {
      if (err.response.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response.status === 404) {
        setError("Item not found in wishlist");
      } else {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      }
    } else if (err.request) {
      setError("Network error - please check your connection");
    } else {
      setError("Failed to process request");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setError("No authentication token found");
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="bg-red-100 p-3 rounded-xl mr-4">
            <FiHeart className="text-red-600 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Wishlist</h2>
            <p className="text-gray-500">Books you want to read</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="bg-red-100 p-3 rounded-xl mr-4">
            <FiHeart className="text-red-600 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Wishlist</h2>
            <p className="text-gray-500">Books you want to read</p>
          </div>
        </div>
        <div className="text-red-500 text-center py-4">
          {error}
          <button
            onClick={fetchWishlist}
            className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="bg-red-100 p-3 rounded-xl mr-4">
          <FiHeart className="text-red-600 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Wishlist</h2>
          <p className="text-gray-500">
            {wishlist.length > 0 ? `${wishlist.length} items` : "Books you want to read"}
          </p>
        </div>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="min-h-[200px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            {wishlist.length === 0 ? (
              <div className="text-center py-8">
                <FiHeart className="mx-auto text-gray-300 text-4xl mb-2" />
                <p className="text-gray-400">Your wishlist is empty</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add books to your wishlist to see them here
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {wishlist.map((book) => (
                  <motion.li 
                    key={book.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="group flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleBookClick(book.id)}
                  >
                    <div className="flex items-start">
                      <img 
                        src={book.cover_image} 
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded mr-4 shadow-sm"
                        onError={(e) => {
                          e.target.src = "/default-book-cover.png";
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{book.title}</h4>
                        <p className="text-sm text-gray-500 mb-1">{book.author}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          <FiClock className="mr-1" />
                          <span>Added {formatDate(book.added_to_wishlist)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => removeFromWishlist(book.id, e)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from wishlist"
                    >
                      <FiTrash2 />
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}