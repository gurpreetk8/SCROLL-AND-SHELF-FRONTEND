import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BookOpen, ArrowLeft, ChevronRight, BookAudio } from 'lucide-react';
import Navbar from '../components/HomePage/Navbar';
import Footer from '../components/HomePage/Footer';

const CategoryEbooks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ebooks, setEbooks] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get('id');

  useEffect(() => {
    const fetchCategoryEbooks = async () => {
      try {
        const formData = new FormData();
        formData.append('id', categoryId);
        
        const response = await axios.post(
          'http://127.0.0.1:8000/ebooks/ebooks_by_category/',
          formData
        );

        if (response.data.success) {
          setEbooks(response.data.ebooks);
          if (response.data.ebooks.length > 0) {
            setCategoryName(response.data.category_name || 'Selected Category');
          }
        } else {
          setError('Failed to fetch category ebooks');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryEbooks();
  }, [categoryId]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-gray-500">Curating {categoryName} collection...</div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-8">
      Error: {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
        <Navbar />
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Categories
          </button>
        </div>

        {/* Category Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center mb-4">
            <BookAudio className="h-8 w-8 text-amber-600" />
            <span className="ml-2 text-xl font-medium tracking-widest text-gray-600">
              {categoryName.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-light text-gray-900">
            Explore <span className="font-serif italic">{categoryName}</span>
          </h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gray-300" />
        </motion.div>

        {/* Ebooks Grid */}
        {ebooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {ebooks.map((ebook, index) => (
              <motion.div
                key={ebook.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/ebook-detail?id=${ebook.id}`)}
              >
                <div className="relative h-96 overflow-hidden bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all">
                  {/* Book Cover */}
                  <img
                    src={`http://127.0.0.1:8000/${ebook.cover_image}`}
                    alt={ebook.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

                  {/* Book Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-medium text-white">{ebook.title}</h3>
                    <p className="text-gray-200 mt-1">{ebook.author}</p>
                  </div>
                </div>

                {/* Hover Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center bg-white/90 px-4 py-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-gray-900 mr-2" />
                    <span className="text-gray-900 font-medium">View Details</span>
                    <ChevronRight className="h-4 w-4 text-gray-900 ml-2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-600 text-xl">
              No ebooks found in this category
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryEbooks;