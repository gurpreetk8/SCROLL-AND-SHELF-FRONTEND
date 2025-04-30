import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrendingBooks = () => {
  const navigate = useNavigate();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/ebooks/trending_books/');
        if (response.data.success) {
          setEbooks(response.data.ebooks);
        } else {
          setError('Failed to fetch trending books');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  const handleBookClick = (ebookId) => {
    navigate(`/ebook-detail?id=${ebookId}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-gray-500">Loading trending books...</div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-8">
      Error: {error}
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center mb-4">
            <Flame className="h-5 w-5 text-orange-400 fill-orange-400" />
            <span className="ml-2 text-sm font-medium tracking-widest text-gray-600">
              CURRENTLY TRENDING
            </span>
          </div>
          <h2 className="text-4xl font-light text-gray-900">
            <span className="font-serif italic">Hot</span> Reads of the Week
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gray-300" />
        </motion.div>

        {/* Ebook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ebooks.map((ebook, index) => (
            <motion.div
              key={ebook.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden cursor-pointer"
              onClick={() => handleBookClick(ebook.id)}
            >
              {/* Trending Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
                  <Flame className="h-4 w-4 text-orange-600" />
                  <span className="ml-1 text-xs font-medium text-orange-900">Trending Now</span>
                </div>
              </div>

              {/* Book Cover */}
              <div className="relative h-96 overflow-hidden bg-gray-50">
                <img 
                  src={`http://127.0.0.1:8000/${ebook.cover_image}`} 
                  alt={ebook.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Book Details */}
              <div className="mt-6">
                <h3 className="text-xl font-medium text-gray-900">{ebook.title}</h3>
                <p className="mt-1 text-gray-600">{ebook.author}</p>
                
                <div className="mt-6 flex items-center justify-between">
                  <button className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors flex items-center">
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="ml-1 text-sm text-gray-600">{index + 1}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button 
            className="inline-flex items-center border border-gray-900 bg-white px-8 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/trending')}
          >
            View All Trending
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingBooks;