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
    message: '',
  });

  // Genre options
  const genres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
    'Historical Fiction', 'Biography', 'Self-Help', 'Non-Fiction', 'Other'
  ];

  // Redirect if not logged in
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Avoid duplicate toasts by checking if it's already shown
    if (!sessionStorage.getItem('loginToastShown')) {
      toast.info("Please log in to request a book.");
      sessionStorage.setItem('loginToastShown', 'true');
    }
    navigate('/login-register');
  } else {
    // Reset flag when user is logged in
    sessionStorage.removeItem('loginToastShown');
  }
}, [navigate]);
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://scrollandshelf.pythonanywhere.com/ebooks/request_book/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      toast.success('Book request submitted successfully!');
      setFormData({ title: '', author: '', genre: '', message: '' });
    } catch (error) {
      toast.error(error.message || 'Error submitting your request.');
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white flex items-center justify-center py-24 px-6">
        <div className="max-w-4xl w-full mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center mb-4 bg-amber-100 px-6 py-2 rounded-full">
              <NotebookPen className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-sm font-medium text-amber-900">REQUEST A BOOK</span>
            </div>
            <h2 className="text-4xl font-light text-gray-900">
              Suggest Your Favorite Titles
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Help us expand our library by suggesting the books you want to see next. Your request matters!
            </p>
          </motion.div>

          {/* Request Form Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl shadow-2xl bg-white border border-amber-100 overflow-hidden"
          >
            <div className="p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Book Title */}
                <div className="relative">
                  <Book className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600" />
                  <input
                    type="text"
                    placeholder="Book Title"
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:border-amber-500 focus:outline-none"
                    value={formData.title}
                    onChange={handleChange('title')}
                    required
                  />
                </div>

                {/* Author */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600" />
                  <input
                    type="text"
                    placeholder="Author Name"
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:border-amber-500 focus:outline-none"
                    value={formData.author}
                    onChange={handleChange('author')}
                    required
                  />
                </div>

                {/* Genre Dropdown */}
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    className="w-full pl-4 pr-10 py-3 border-b border-gray-300 focus:border-amber-500 focus:outline-none appearance-none text-gray-700"
                    value={formData.genre}
                    onChange={handleChange('genre')}
                    required
                  >
                    <option value="" disabled>Select Genre</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-amber-600" />
                  <textarea
                    placeholder="Additional Message (Optional)"
                    rows="4"
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:border-amber-500 focus:outline-none"
                    value={formData.message}
                    onChange={handleChange('message')}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Request</span>
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
