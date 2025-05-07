import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BookOpen, Download, ArrowLeft, Bookmark, Star } from 'lucide-react';
import Footer from '../components/HomePage/Footer';
import Navbar from '../components/HomePage/Navbar';
import ReviewRating from '../components/EbookDetails/ReviewRating';

const EbookDetail = () => {
  const [ebook, setEbook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [readingLoading, setReadingLoading] = useState(false);
  const [ratings, setRatings] = useState({ average: 0, count: 0 });
  const [showWishlistText, setShowWishlistText] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const ebookId = queryParams.get('id');

  const fetchBookReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/get_book_reviews/',
        { ebook_id: ebookId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setRatings({
          average: response.data.average_rating,
          count: response.data.total_reviews
        });
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const checkReadingStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/get_reading_books/',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const isCurrentlyReading = response.data.books.some(book => book.id.toString() === ebookId);
        setIsReading(isCurrentlyReading);
      }
    } catch (err) {
      console.error('Error checking reading status:', err);
    }
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add to wishlist.');
      return;
    }

    setWishlistLoading(true);
    try {
      const response = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/add_to_wishlist/',
        { ebook_id: ebookId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setIsInWishlist(true);
        setWishlistId(response.data.wishlist_id);
        setShowWishlistText(true);
        setTimeout(() => setShowWishlistText(false), 3000);
      }
    } catch (err) {
      setError('Error adding to wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReadNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to read books.');
      return;
    }

    setReadingLoading(true);
    try {
      const readingResponse = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/ebooks/add_reading_book/',
        { id: ebookId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (readingResponse.data.success) {
        navigate(`/read?id=${ebookId}`);
      } else {
        setError(readingResponse.data.message || 'Failed to add book to reading list.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error preparing book for reading.');
    } finally {
      setReadingLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token || !ebookId) return;

    try {
      // You might want to add an API endpoint to check wishlist status
      // For now, we'll assume the bookmark button shows the visual state only
      // and the actual check would be done via a separate API call
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  useEffect(() => {
    const fetchEbookDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view book details.');
        setLoading(false);
        return;
      }

      if (!ebookId) {
        setError('Invalid book ID.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          'https://scrollandshelf.pythonanywhere.com/ebooks/ebook_detail/',
          { id: ebookId },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setEbook(response.data.ebook);
          await checkWishlistStatus();
          await fetchBookReviews();
          await checkReadingStatus();
        } else {
          setError(response.data.message || 'Failed to fetch ebook details.');
        }
      } catch (err) {
        setError('Error fetching ebook details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEbookDetails();
  }, [ebookId]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-gray-500">Loading book details...</div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-8">
      Error: {error}
    </div>
  );

  if (!ebook) return null;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 fill-current text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} className="h-5 w-5 fill-current text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-amber-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Book Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Collection
          </button>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Book Cover */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="relative group"
            >
              <div className="relative h-[600px] w-full bg-gray-100 rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={`https://scrollandshelf.pythonanywhere.com/${ebook.cover_image}`}
                  alt={ebook.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>

            {/* Book Details */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex flex-col justify-center"
            >
              <div className="mb-6">
                <h1 className="text-4xl font-serif italic text-gray-900 mb-4">{ebook.title}</h1>
                <p className="text-2xl font-light text-gray-600">by {ebook.author}</p>
              </div>

              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center text-amber-400">
                  {renderStars(ratings.average)}
                </div>
                <span className="text-gray-600">
                  ({ratings.average.toFixed(1)}/5 from {ratings.count} reviews)
                </span>
              </div>

              <p className="text-lg font-light text-gray-600 leading-relaxed mb-8">
                {ebook.description}
              </p>

              {/* Tags Section */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-2"></h3>
                <div className="flex flex-wrap gap-2">
                  {ebook.tags?.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {(!ebook.tags || ebook.tags.length === 0) && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      Fiction
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                {ebook.file_url ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={handleReadNow}
                      disabled={readingLoading}
                      className="flex items-center bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-500"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      {readingLoading ? 'Loading...' : isReading ? 'Continue Reading' : 'Read Now'}
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href={`https://scrollandshelf.pythonanywhere.com/${ebook.file_url}`}
                      className="flex items-center bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Now
                    </motion.a>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-lg hover:from-amber-600 hover:to-amber-700"
                    onClick={() => navigate('/subscribe')}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Subscribe to Access
                  </motion.button>
                )}
                <div className="relative group">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    onClick={handleAddToWishlist}
                    disabled={wishlistLoading || isInWishlist}
                    className={`p-3 rounded-full border ${isInWishlist ? 'bg-amber-100 border-amber-300' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Bookmark 
                      className={`h-5 w-5 ${isInWishlist ? 'text-amber-600 fill-amber-600' : 'text-gray-600'}`} 
                    />
                  </motion.button>
                  {showWishlistText && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                      Added to wishlist
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Reviews and Ratings */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <ReviewRating ebookId={ebook.id} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EbookDetail;