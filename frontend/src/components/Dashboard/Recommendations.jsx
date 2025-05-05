import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/ebooks/";
  const token = localStorage.getItem("token");

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      if (!token) {
        throw new Error("No authentication token found");
      }

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
        setRecommendations(response.data.recommendations || []);
      } else {
        setError(response.data.message || "Failed to fetch recommendations");
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
        localStorage.removeItem("token");
        navigate("/login");
        return;
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
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended for You</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[120px] flex-shrink-0">
              <Skeleton height={144} width={96} className="mx-auto rounded-lg" />
              <Skeleton width={80} className="mx-auto mt-2" />
              <Skeleton width={60} className="mx-auto mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended for You</h2>
        <div className="text-center py-4">
          <p className="text-red-500 mb-3">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended for You</h2>
      
      {recommendations.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto pb-4 px-1">
          {recommendations.map((book) => (
            <div
              key={book.id}
              className="min-w-[120px] flex-shrink-0 text-center transform transition-transform hover:scale-105"
            >
              <img
                src={book.cover || `https://via.placeholder.com/100x150?text=${encodeURIComponent(book.title.substring(0, 10))}`}
                alt={book.title}
                className="w-24 h-36 object-cover rounded-lg shadow-md mx-auto"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/100x150?text=${encodeURIComponent(book.title.substring(0, 10))}`;
                }}
              />
              <h3 className="text-sm font-semibold mt-2 text-gray-800 line-clamp-2">{book.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{book.author}</p>
              {book.reason && (
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {book.reason}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No recommendations available. Start adding books to your wishlist or reading list!
        </div>
      )}
    </div>
  );
}