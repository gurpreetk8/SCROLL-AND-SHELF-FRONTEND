import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiStar, FiClock } from "react-icons/fi";
import axios from "axios";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/ebooks/";
  const token = localStorage.getItem("token");

  const fetchRecommendations = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      if (!token) throw new Error("Please login first");

      const response = await axios.post(
        `${API_BASE_URL}recommend_books/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setRecommendations(response.data.recommendations.map(book => ({
          ...book,
          rating: book.avg_rating || 0,
          ratingCount: book.rating_count || 0
        })));
      } else {
        setError(response.data.message || "Failed to fetch recommendations");
      }
    } catch (err) {
      if (retryCount < 1) {
        setTimeout(() => fetchRecommendations(retryCount + 1), 2000);
      } else {
        handleApiError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (ebookId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${API_BASE_URL}add_to_wishlist/`,
        { ebook_id: ebookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message || "Added to wishlist");
        setTimeout(() => setSuccessMessage(null), 3000);
        // Optionally refresh recommendations after adding
        // fetchRecommendations();
      } else {
        setError(response.data.message || "Failed to add to wishlist");
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
      } else {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      }
    } else if (err.request) {
      setError("Network error - please check your connection");
    } else {
      setError(err.message || "Failed to process request");
    }
  };

  useEffect(() => {
    if (token) {
      fetchRecommendations();
    } else {
      setError("No authentication token found");
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <FiStar className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
            <p className="text-gray-500">Books you might enjoy</p>
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
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <FiStar className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
            <p className="text-gray-500">Books you might enjoy</p>
          </div>
        </div>
        <div className="text-red-500 text-center py-4">
          {error}
          <button
            onClick={fetchRecommendations}
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
        <div className="bg-blue-100 p-3 rounded-xl mr-4">
          <FiStar className="text-blue-600 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
          <p className="text-gray-500">
            {recommendations.length > 0 ? `${recommendations.length} suggestions` : "Books you might enjoy"}
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
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <FiStar className="mx-auto text-gray-300 text-4xl mb-2" />
                <p className="text-gray-400">No recommendations available</p>
                <p className="text-gray-400 text-sm mt-1">
                  We'll show personalized recommendations here
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {recommendations.map((book) => (
                  <motion.li 
                    key={book.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="group flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start">
                      <img 
                        src={book.cover_url || book.cover_image} 
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
                          <div className="flex items-center mr-3 text-yellow-500">
                            <FiStar className="fill-current mr-1" />
                            <span className="text-gray-600">
                              {book.rating?.toFixed(1) || '0.0'} ({book.ratingCount || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addToWishlist(book.id)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Add to wishlist"
                    >
                      <FiHeart />
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