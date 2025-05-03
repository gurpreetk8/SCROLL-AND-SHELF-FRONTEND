import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BookOpen, Download, ArrowLeft, Bookmark, Share2, Star } from 'lucide-react';
import Footer from '../components/HomePage/Footer';
import Navbar from '../components/HomePage/Navbar';
import ReviewRating from '../components/EbookDetails/ReviewRating';

const EbookDetail = () => {
  const [ebook, setEbook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const ebookId = queryParams.get('id');

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
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8/5 from 1.2k reviews)</span>
              </div>

              <p className="text-lg font-light text-gray-600 leading-relaxed mb-8">
                {ebook.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                {ebook.file_url ? (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href={`https://scrollandshelf.pythonanywhere.com/${ebook.file_url}`}
                    className="flex items-center bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Now
                  </motion.a>
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
                <button className="p-3 rounded-full border border-gray-200 hover:border-gray-300">
                  <Bookmark className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-3 rounded-full border border-gray-200 hover:border-gray-300">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Sample Images Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-gray-900 mb-8">Preview Pages</h2>
          <div className="flex overflow-x-auto pb-6 space-x-4 scrollbar-hide">
            {ebook.sample_images.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="flex-shrink-0 relative w-64 h-96 bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={`https://scrollandshelf.pythonanywhere.com/${image}`}
                  alt={`Sample ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
