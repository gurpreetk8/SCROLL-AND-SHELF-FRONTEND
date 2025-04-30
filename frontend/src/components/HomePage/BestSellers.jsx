import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BestSellers = () => {
  const navigate = useNavigate();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/ebooks/best_sellers/');
        if (response.data.success) {
          setEbooks(response.data.ebooks);
        } else {
          setError('Failed to fetch best sellers');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const handleBookClick = (ebookId) => {
    navigate(`/ebook-detail?id=${ebookId}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-gray-500">Loading best sellers...</div>
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
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            <span className="ml-2 text-sm font-medium tracking-widest text-gray-600">
              CURATED SELECTION
            </span>
          </div>
          <h2 className="text-4xl font-light text-gray-900">
            Our <span className="font-serif italic">Bestselling</span> Collection
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gray-300" />
        </motion.div>

        {/* Ebook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
              {/* Book Cover */}
              <div className="relative h-80 overflow-hidden bg-gray-50">
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
                <p className="mt-3 text-gray-500 line-clamp-2">{ebook.description}</p>
                
                <div className="mt-6 flex items-center justify-between">
                  <button className="text-sm font-medium text-gray-900 hover:text-amber-600 transition-colors flex items-center">
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="ml-1 text-sm text-gray-600">Bestseller</span>
                  </div>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute -right-8 -top-8 w-16 h-16 bg-amber-100 transform rotate-45" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button 
            className="inline-flex items-center border border-gray-900 bg-white px-8 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/ebooks')}
          >
            View All Bestsellers
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default BestSellers;