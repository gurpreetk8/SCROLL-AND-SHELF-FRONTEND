import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Trophy, BookOpen } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookOfTheMonth = () => {
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookOfMonth = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/ebooks/best_of_month_book/');
        if (response.data.success) {
          setEbook(response.data.ebook);
        } else {
          setError('Failed to fetch book of the month');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookOfMonth();
  }, []);

  const handleExploreClick = () => {
    navigate(`/ebook-detail?id=${ebook.id}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[600px]">
      <div className="animate-pulse text-gray-500">Loading book of the month...</div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-8">
      Error: {error}
    </div>
  );

  if (!ebook) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gray-50 border border-gray-200"
        >
          {/* Decorative Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center bg-amber-100 px-6 py-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <span className="ml-2 text-sm font-medium text-amber-900">Book of the Month</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 p-12">
            {/* Book Cover Section */}
            <motion.div 
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] overflow-hidden bg-gray-100"
            >
              <img
                src={`http://127.0.0.1:8000/${ebook.cover_image}`}
                alt={ebook.title}
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
            </motion.div>

            {/* Book Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-light text-gray-600 mb-2">Featured Selection</h3>
                <h2 className="text-4xl font-serif italic text-gray-900">{ebook.title}</h2>
                <p className="mt-2 text-xl font-light text-gray-600">by {ebook.author}</p>
              </div>

              <div className="my-6">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400 mx-1" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span className="ml-3 text-gray-600">(Monthly Bestseller)</span>
                </div>
                
                <p className="text-lg font-light text-gray-600 leading-relaxed">
                  {ebook.description}
                </p>
              </div>

              {/* Sample Images Gallery */}
              <div className="grid grid-cols-3 gap-4 my-8">
                {ebook.sample_images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative h-32 overflow-hidden bg-gray-200 cursor-pointer"
                  >
                    <img
                      src={`http://127.0.0.1:8000/${image}`}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ x: 5 }}
                onClick={handleExploreClick}
                className="self-start flex items-center bg-gray-900 text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Explore This Book
                <ArrowRight className="h-4 w-4 ml-2" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookOfTheMonth;