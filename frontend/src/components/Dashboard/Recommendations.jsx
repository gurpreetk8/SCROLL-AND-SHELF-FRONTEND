// components/Dashboard/Recommendations.jsx
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        
        const response = await fetch('https://scrollandshelf.pythonanywhere.com/ebooks/recommend_books/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired. Please refresh the page.');
          }
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        if (data.success) {
          setRecommendations(data.recommendations);
        } else {
          throw new Error(data.message || 'Failed to load recommendations');
        }
      } catch (err) {
        console.error('Recommendation error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended for You</h2>
        <div className="text-red-500 text-center py-4">
          {error}
          {error.includes('expired') && (
            <button 
              onClick={() => window.location.reload()}
              className="ml-2 text-blue-600 underline"
            >
              Refresh
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended for You</h2>
      
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[120px] flex-shrink-0">
              <Skeleton height={144} width={96} className="mx-auto rounded-lg" />
              <Skeleton width={80} className="mx-auto mt-2" />
              <Skeleton width={60} className="mx-auto mt-1" />
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
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