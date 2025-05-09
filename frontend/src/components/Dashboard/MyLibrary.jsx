import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Loader2, Clock } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyLibrary() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/ebooks/";
  const token = localStorage.getItem("token");

  const fetchReadingBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await axios.post(
        `${API_BASE_URL}get_reading_books/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setBooks(response.data.books || []);
        if (response.data.books.length === 0) {
          setSuccessMessage("You're not currently reading any books");
        }
      } else {
        setError(response.data.message || "Failed to fetch reading books");
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
      fetchReadingBooks();
    } else {
      setError("No authentication token found");
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <BookOpen className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Currently Reading</h2>
            <p className="text-gray-500">Books you're actively reading</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-12 w-12 border-t-2 border-b-2 border-gray-300" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <BookOpen className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Currently Reading</h2>
            <p className="text-gray-500">Books you're actively reading</p>
          </div>
        </div>
        <div className="text-red-500 text-center py-4">
          {error}
          <button
            onClick={fetchReadingBooks}
            className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-xl mr-4">
          <BookOpen className="text-blue-600 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Currently Reading</h2>
          <p className="text-gray-500">
            {books.length > 0 ? `${books.length} book${books.length !== 1 ? 's' : ''}` : "Books you're actively reading"}
          </p>
        </div>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg"
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
          {books.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto text-gray-300 text-4xl mb-2" />
              <p className="text-gray-400">You're not currently reading any books</p>
              <p className="text-gray-400 text-sm mt-1">
                Start reading books to see them here
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {books.map((book) => (
                <motion.li 
                  key={book.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="group flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start">
                    <img 
                      src={book.cover_image || "/default-book-cover.png"} 
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded mr-4 shadow-sm"
                      onError={(e) => {
                        e.target.src = "/default-book-cover.png";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{book.title}</h4>
                      <p className="text-sm text-gray-500 mb-1">{book.author || "Unknown Author"}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Last read: {formatDate(book.last_read)}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/read/${book.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    Continue 
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};