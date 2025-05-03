import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare, User, Calendar, Edit, Trash2 } from 'lucide-react';

const ReviewRating = ({ ebookId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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
        setEditing(false);
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

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-gray-600">{averageRating.toFixed(1)} out of 5</span>
        </div>
        <p className="text-gray-500">{totalReviews} review(s)</p>
      </div>

      {/* Write/Edit Form */}
      {token && (editing || !userReview) && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded-lg">
          <div className="mb-3">
            <label className="block font-medium mb-1">Your Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <button type="button" key={s} onClick={() => handleRatingChange(s)}>
                  <Star
                    className={`w-7 h-7 ${s <= formData.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <textarea
            name="review_text"
            rows="3"
            className="w-full border rounded-md p-2 mb-3"
            placeholder="Your review..."
            value={formData.review_text}
            onChange={handleInputChange}
          ></textarea>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
            {userReview && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* User's Own Review */}
      {userReview && !editing && (
        <div className="mb-6 p-4 bg-amber-50 border rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold flex items-center mb-1">
                <User className="w-4 h-4 mr-1" /> Your Review
              </p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= userReview.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  {formatDate(userReview.created_at)}
                </span>
              </div>
              <p className="mt-2">{userReview.review_text}</p>
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={() => setEditing(true)} title="Edit">
                <Edit className="w-5 h-5 text-amber-600 hover:text-amber-800" />
              </button>
              <button onClick={handleDelete} title="Delete">
                <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Reviews */}
      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="border-b pb-4">
            <div className="flex items-center mb-1">
              <User className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-700">{r.username}</span>
              <span className="text-sm text-gray-400 ml-2">
                <Calendar className="w-3 h-3 inline-block mr-1" />
                {formatDate(r.created_at)}
              </span>
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            {r.review_text && <p className="mt-1 text-gray-700">{r.review_text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewRating;
