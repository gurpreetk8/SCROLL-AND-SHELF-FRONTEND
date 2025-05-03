import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare, User, Calendar, Edit, Trash2, X } from 'lucide-react';

const ReviewRating = ({ ebookId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ rating: 0, review_text: '' });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsRes = await axios.post(
          'https://scrollandshelf.pythonanywhere.com/ebooks/get_book_reviews/',
          { ebook_id: ebookId }
        );
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews);
          setAverageRating(reviewsRes.data.average_rating);
          setTotalReviews(reviewsRes.data.total_reviews);
        }

        if (token) {
          const userReviewRes = await axios.post(
            'https://scrollandshelf.pythonanywhere.com/ebooks/get_user_review/',
            { ebook_id: ebookId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (userReviewRes.data.has_review) {
            setUserReview(userReviewRes.data.review);
            setFormData({
              rating: userReviewRes.data.review.rating,
              review_text: userReviewRes.data.review.review_text || '',
            });
          }
        }
      } catch (err) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ebookId, token]);

  const handleRatingChange = (star) => {
    setFormData((prev) => ({ ...prev, rating: star }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/submit_review/',
        {
          ebook_id: ebookId,
          ...formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const updated = await axios.post(
          'https://scrollandshelf.pythonanywhere.com/ebooks/get_book_reviews/',
          { ebook_id: ebookId }
        );
        setReviews(updated.data.reviews);
        setAverageRating(updated.data.average_rating);
        setTotalReviews(updated.data.total_reviews);
        setUserReview({
          id: res.data.review_id,
          rating: formData.rating,
          review_text: formData.review_text,
          created_at: new Date().toISOString(),
        });
        setSubmissionSuccess(true);
        setTimeout(() => {
          setSubmissionSuccess(false);
          setShowModal(false);
        }, 2000);
      }
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/delete_review/',
        { review_id: userReview.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/get_book_reviews/',
        { ebook_id: ebookId }
      );
      setReviews(updated.data.reviews);
      setAverageRating(updated.data.average_rating);
      setTotalReviews(updated.data.total_reviews);
      setUserReview(null);
      setFormData({ rating: 0, review_text: '' });
    } catch (err) {
      alert('Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const resetForm = () => {
    setFormData(userReview ? {
      rating: userReview.rating,
      review_text: userReview.review_text
    } : { rating: 0, review_text: '' });
    setShowModal(false);
    setSubmissionSuccess(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Summary Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center">
                <div className="text-4xl font-bold text-gray-800 mr-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {token && (
            <button
              onClick={() => {
                setShowModal(true);
                setFormData(userReview ? {
                  rating: userReview.rating,
                  review_text: userReview.review_text
                } : { rating: 0, review_text: '' });
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors shadow-sm"
            >
              {userReview ? 'Update Review' : 'Write a Review'}
            </button>
          )}
        </div>
      </div>

      {/* User's Own Review */}
      {userReview && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Your Review</h3>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="flex mr-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${s <= userReview.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(userReview.created_at)}
                </span>
              </div>
              
              <p className="text-gray-700 whitespace-pre-line">{userReview.review_text}</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setFormData({
                    rating: userReview.rating,
                    review_text: userReview.review_text
                  });
                  setShowModal(true);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Edit review"
              >
                <Edit className="w-5 h-5 text-amber-600 hover:text-amber-800" />
              </button>
              <button 
                onClick={handleDelete} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Delete review"
              >
                <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Reviews */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Customer Reviews ({totalReviews})
        </h3>
        
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{r.username}</p>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              
              {r.review_text && (
                <p className="text-gray-700 mt-2 whitespace-pre-line">{r.review_text}</p>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            {token && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors shadow-sm"
              >
                Write a Review
              </button>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {userReview ? 'Update Your Review' : 'Write a Review'}
              </h3>
              <button 
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {submissionSuccess ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h4>
                <p className="text-gray-600">Your review has been {userReview ? 'updated' : 'submitted'} successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label className="block font-medium text-gray-700 mb-3">Your Rating</label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        type="button" 
                        key={s} 
                        onClick={() => handleRatingChange(s)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${s <= formData.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="review_text" className="block font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="review_text"
                    name="review_text"
                    rows="5"
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="Share your detailed thoughts about this book..."
                    value={formData.review_text}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-sm disabled:opacity-50"
                    disabled={loading || formData.rating === 0}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {userReview ? 'Updating...' : 'Submitting...'}
                      </span>
                    ) : (
                      userReview ? 'Update Review' : 'Submit Review'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewRating;