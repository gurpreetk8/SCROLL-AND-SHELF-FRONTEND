import { useState, useEffect } from "react";
import { BookOpen, Download, Loader2 } from "lucide-react";
import axios from "axios";

export default function MyLibrary() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/ebooks/";
  const token = localStorage.getItem("token");

  const fetchReadingBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
        setBooks(response.data.books);
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Currently Reading</h2>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Currently Reading</h2>
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
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Currently Reading {books.length > 0 && `(${books.length})`}
      </h2>
      
      {books.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="mx-auto text-gray-300 h-12 w-12 mb-2" />
          <p className="text-gray-500">You're not currently reading any books</p>
          <p className="text-gray-400 text-sm mt-1">
            Start reading books to see them here
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition"
            >
              <img
                src={book.cover_image || "/default-book-cover.png"}
                alt={book.title}
                className="w-24 h-36 object-cover rounded"
                onError={(e) => {
                  e.target.src = "/default-book-cover.png";
                }}
              />
              <h3 className="mt-3 font-semibold text-gray-700">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{book.author || "Unknown Author"}</p>
              
              <div className="text-xs text-gray-400 space-y-1 mb-3">
                <p>Started: {formatDate(book.started_reading)}</p>
                <p>Last read: {formatDate(book.last_read)}</p>
              </div>
              
              <div className="mt-auto flex flex-col gap-2 w-full">
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <BookOpen className="w-4 h-4" />
                  Continue Reading
                </button>
                <a
                  href={`/books/${book.id}/download`}
                  download
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}