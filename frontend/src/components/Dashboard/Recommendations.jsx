import { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { FiHeart, FiStar } from 'react-icons/fi';

export default function Recommendations() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    recommendations: []
  });

  const fetchRecommendations = async (retryCount = 0) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first');

      const { data } = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/recommend_books/',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) throw new Error(data.message);

      setState({
        loading: false,
        error: null,
        recommendations: data.recommendations.map(book => ({
          ...book,
          // Use actual rating from API
          rating: book.avg_rating || 0,
          ratingCount: book.rating_count || 0
        }))
      });

    } catch (error) {
      if (retryCount < 1) {
        setTimeout(() => fetchRecommendations(retryCount + 1), 2000);
      } else {
        setState({
          loading: false,
          error: error.response?.data?.message || error.message,
          recommendations: []
        });
      }
    }
  };

  useEffect(() => { fetchRecommendations(); }, []);

  const addToWishlist = async (bookId) => {
    try {
      await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/add_to_wishlist/',
        { ebook_id: bookId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchRecommendations(); // Refresh recommendations after adding
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  if (state.error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-3">Recommended For You</h2>
        <div className="text-red-500 mb-4">{state.error}</div>
        <button
          onClick={() => fetchRecommendations()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
      
      {state.loading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32">
              <Skeleton height={160} className="rounded-lg mb-2" />
              <Skeleton width={100} className="mb-1" />
              <Skeleton width={80} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {state.recommendations.map(book => (
            <div 
              key={book.id} 
              className="flex-shrink-0 w-32 transition-transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={book.cover_url || '/default-book.png'}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded-lg shadow"
                  onError={(e) => {
                    e.target.src = '/default-book.png';
                  }}
                />
                <button 
                  onClick={() => addToWishlist(book.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-red-100"
                  aria-label="Add to wishlist"
                >
                  <FiHeart className="text-gray-600 hover:text-red-500" />
                </button>
              </div>
              <h3 className="text-sm font-semibold mt-2 line-clamp-2">{book.title}</h3>
              <p className="text-xs text-gray-500 mb-1">{book.author}</p>
              <div className="flex items-center text-xs text-yellow-500">
                <FiStar className="fill-current" />
                <span className="ml-1 text-gray-600">
                  {book.rating.toFixed(1)} ({book.ratingCount})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}