// components/RequestBookModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, User, ChevronDown, MessageSquare, Send, X } from 'lucide-react';
import { toast } from 'react-toastify';

const RequestBook = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    message: ''
  });

  const genres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
    'Historical Fiction', 'Biography', 'Self-Help', 'Non-Fiction', 'Other'
  ];

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to request a book.');
      onClose(); // Close modal instead of navigate
      return;
    }

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
      onClose();
    } catch (error) {
      toast.error(error.message || 'Error submitting your request.');
      if (error.message.toLowerCase().includes('token')) {
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white max-w-xl w-full mx-4 rounded-xl shadow-xl p-6 relative"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-light mb-6 text-center">Request a <span className="font-serif italic">Book</span></h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Book className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Book Title"
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-blue-600 focus:outline-none bg-transparent"
                  value={formData.title}
                  onChange={handleChange('title')}
                  required
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Author Name"
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-blue-600 focus:outline-none bg-transparent"
                  value={formData.author}
                  onChange={handleChange('author')}
                  required
                />
              </div>

              <div className="relative">
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <select
                  className="w-full pl-4 pr-10 py-3 border-b border-gray-200 focus:border-blue-600 focus:outline-none appearance-none bg-transparent"
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

              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <textarea
                  placeholder="Additional Message (Optional)"
                  rows="4"
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-blue-600 focus:outline-none bg-transparent"
                  value={formData.message}
                  onChange={handleChange('message')}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Send className="h-5 w-5" />
                <span>Send Request</span>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestBook;
