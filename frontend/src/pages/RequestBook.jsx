import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book, User, ChevronDown, MessageSquare, Send, NotebookPen } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/HomePage/Navbar';
import Footer from '../components/HomePage/Footer';

const RequestBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    message: '', // Optional but will be sent even if empty
  });

  const genres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
    'Historical Fiction', 'Biography', 'Self-Help', 'Non-Fiction', 'Other'
  ];

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (!sessionStorage.getItem('loginToastShown')) {
        toast.info("Please log in to request a book");
        sessionStorage.setItem('loginToastShown', 'true');
      }
      navigate('/login-register');
    } else {
      sessionStorage.removeItem('loginToastShown');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please log in to continue');
      navigate('/login-register');
      return;
    }

    try {
      // Explicitly include message field even if empty
      const payload = {
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        message: formData.message || null // Send null if empty
      };

      const response = await fetch('https://scrollandshelf.pythonanywhere.com/ebooks/request_book/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request');
      }

      toast.success('Book request submitted successfully!');
      setFormData({
        title: '',
        author: '',
        genre: '',
        message: ''
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Error submitting request');
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center py-24 px-4 sm:px-6">
        <div className="max-w-2xl w-full mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center mb-4 bg-amber-100 px-5 py-2 rounded-full"
            >
              <NotebookPen className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-sm font-medium text-amber-800">BOOK REQUEST</span>
            </motion.div>
            <h1 className="text-4xl font-light text-gray-900 mb-3">
              Suggest <span className="font-serif italic">Your</span> Next Read
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Can't find what you're looking for? Request it and we'll consider adding it to our collection.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Book Title */}
                <div className="relative">
                  <Book className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600" />
                  <input
                    type="text"
                    name="title"
                    placeholder="Book Title *"
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-amber-500 focus:outline-none bg-transparent"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Author */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600" />
                  <input
                    type="text"
                    name="author"
                    placeholder="Author Name *"
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-amber-500 focus:outline-none bg-transparent"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Genre */}
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    name="genre"
                    className="w-full pl-4 pr-10 py-3 border-b border-gray-200 focus:border-amber-500 focus:outline-none appearance-none bg-transparent"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Genre *</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Message (Optional) */}
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-amber-600" />
                  <textarea
                    name="message"
                    placeholder="Additional Message (Optional)"
                    rows="4"
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-amber-500 focus:outline-none bg-transparent"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Send className="h-5 w-5" />
                  <span>Submit Request</span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RequestBook;