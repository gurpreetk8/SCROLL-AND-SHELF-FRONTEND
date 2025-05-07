import { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

export default function Recommendations() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    recommendations: []
  });

  const fetchRecommendations = async () => {
    try {
      setState({ loading: true, error: null, recommendations: [] });
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first');

      const response = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/recommend_books/',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load recommendations');
      }

      setState({
        loading: false,
        error: null,
        recommendations: response.data.recommendations
      });

    } catch (error) {
      setState({
        loading: false,
        error: error.response?.data?.message || error.message,
        recommendations: []
      });
    }
  };

  useEffect(() => { fetchRecommendations(); }, []);

  if (state.error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Recommended For You</h2>
        <p className="text-red-500 mb-2">{state.error}</p>
        <button 
          onClick={fetchRecommendations}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (state.loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
        <div className="flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-24">
              <Skeleton height={144} />
              <Skeleton width={80} className="mt-2" />
              <Skeleton width={60} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
      
      {state.recommendations.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {state.recommendations.map(book => (
            <div key={book.id} className="flex-shrink-0 w-24 text-center">
              <img
                src={book.cover_image || '/placeholder-book.png'}
                alt={book.title}
                className="w-full h-36 object-cover rounded"
              />
              <h3 className="text-sm font-medium mt-1 line-clamp-2">{book.title}</h3>
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 py-4 text-center">
          No recommendations available. Try adding books to your wishlist!
        </p>
      )}
    </div>
  );
}