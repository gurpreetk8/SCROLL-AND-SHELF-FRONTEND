import { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to view recommendations.');
      }

      const response = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/recommend_books/',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'API returned unsuccessful response');
      }

      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      console.error('API Error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to load recommendations'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecommendations(); }, []);

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
      
      {loading ? (
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[120px]">
              <Skeleton height={144} width={96} className="rounded-lg" />
              <Skeleton width={80} className="mt-2" />
              <Skeleton width={60} className="mt-1" />
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recommendations.map((book) => (
            <div key={book.id} className="min-w-[120px] text-center">
              <img
                src={book.cover_url || `https://via.placeholder.com/100x150?text=No+Cover`}
                alt={book.title}
                className="w-24 h-36 object-cover rounded-lg mx-auto"
              />
              <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">
          No recommendations found. Add books to your wishlist!
        </p>
      )}
    </div>
  );
}