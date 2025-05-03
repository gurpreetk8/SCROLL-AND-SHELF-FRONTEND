import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare, User, Calendar, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Assuming you have an auth context

const ReviewRating = ({ ebookId }) => {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    review_text: ''
  });

  // Fetch reviews and user's review
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all reviews for this ebook
        const reviewsResponse = await axios.post(
          'https://scrollandshelf.pythonanywhere.com/ebooks/get_book_reviews/',
          { ebook_id: ebookId }
        );

        if (reviewsResponse.data.success) {
          setReviews(reviewsResponse.data.reviews);
          setAverageRating(reviewsResponse.data.average_rating);
          setTotalReviews(reviewsResponse.data.total_reviews);
        }

        // Get current user's review if logged in
        if (token) {
          const userReviewResponse = await axios.post(
            'https://scrollandshelf.pythonanywhere.com/ebooks/get_user_review/',
            { ebook_id: ebookId },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (userReviewResponse.data.has_review) {
            setUserReview(userReviewResponse.data.review);
            setFormData({
              rating: userReviewResponse.data.review.rating,
              review_text: userReviewResponse.data.review.review_text || ''
            });
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ebookId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/submit_review/',
        {
          ebook_id: ebookId,
          ...formData
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Refresh reviews
        const reviewsResponse = await axios.post(
          'https://scrollandshelf.pythonanywhere.com/ebooks/get_book_reviews/',
          { ebook_id: ebookId }
        );
        setReviews(reviewsResponse.data.reviews);
        setAverageRating(reviewsResponse.data.average_rating);
        setTotalReviews(reviewsResponse.data.total_reviews);
        
        // Update user review
        setUserReview({
          id: response.data.review_id || userReview?.id,
          rating: formData.rating,
          review_text: formData.review_text,
          created_at: new Date().toISOString()
        });
        
        setEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;
    
    try {
      setLoading(true);
      await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/delete_review/',
        { review_id: userReview.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh data
      const reviewsResponse = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/get_book_reviews/',
        { ebook_id: ebookId }
      );
      setReviews(reviewsResponse.data.reviews);
      setAverageRating(reviewsResponse.data.average_rating);
      setTotalReviews(reviewsResponse.data.total_reviews);
      setUserReview(null);
      setFormData({ rating: 0, review_text: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !reviews.length) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          <div className="flex items-center mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {averageRating.toFixed(1)} out of 5
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {token && !editing && !userReview && (
          <button
            onClick={() => setEditing(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form (when editing) */}
      {editing && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-medium mb-4">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= formData.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="review_text" className="block text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="review_text"
                name="review_text"
                rows="4"
                value={formData.review_text}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Share your thoughts about this book..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  if (!userReview) {
                    setFormData({ rating: 0, review_text: '' });
                  }
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User's Review */}
      {userReview && !editing && (
        <div className="bg-amber-50 p-6 rounded-lg mb-8 border border-amber-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <User className="h-5 w-5 text-amber-600 mr-2" />
                Your Review
              </h3>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= userReview.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">
                  {formatDate(userReview.created_at)}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditing(true)}
                className="text-amber-600 hover:text-amber-800 p-1"
                title="Edit review"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete review"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          {userReview.review_text && (
            <p className="mt-3 text-gray-700">{userReview.review_text}</p>
          )}
        </div>
      )}

      {/* All Reviews */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Customer Reviews
        </h3>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    {review.user.name || review.user.email.split('@')[0]}
                  </h4>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= review.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm ml-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              {review.review_text && (
                <p className="mt-3 text-gray-700">{review.review_text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewRating;