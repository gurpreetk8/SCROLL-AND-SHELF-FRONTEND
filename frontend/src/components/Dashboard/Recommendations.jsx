import { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

export default function Recommendations() {
  const [data, setData] = useState({
    recommendations: [],
    loading: true,
    error: null
  });

  const fetchRecommendations = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first');

      const res = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/recommend_books/',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.success) throw new Error(res.data.message);

      setData({
        recommendations: res.data.recommendations,
        loading: false,
        error: null
      });

    } catch (err) {
      setData({
        recommendations: [],
        loading: false,
        error: err.response?.data?.error || err.message
      });
    }
  };

  useEffect(() => { fetchRecommendations(); }, []);

  if (data.error) {
    return (
      <div className="recommendation-error">
        <h2>Recommended For You</h2>
        <p className="error">{data.error}</p>
        <button onClick={fetchRecommendations}>Retry</button>
      </div>
    );
  }

  if (data.loading) {
    return (
      <div className="recommendation-loading">
        <h2>Recommended For You</h2>
        <div className="skeleton-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="book-skeleton">
              <Skeleton height={150} />
              <Skeleton width={100} />
              <Skeleton width={80} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations">
      <h2>Recommended For You</h2>
      
      {data.recommendations.length > 0 ? (
        <div className="book-grid">
          {data.recommendations.map(book => (
            <div key={book.id} className="book-card">
              <img 
                src={book.cover_url || '/placeholder-book.jpg'} 
                alt={book.title}
              />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">
          No recommendations found. Try adding more books to your wishlist!
        </p>
      )}
    </div>
  );
}