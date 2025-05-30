import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, User, ChevronDown, MessageSquare, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequestBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    message: ''
  });

  const navigate = useNavigate();

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
      navigate('/login-register');
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
    } catch (error) {
      toast.error(error.message || 'Error submitting your request.');
      if (error.message.toLowerCase().includes('token')) {
        navigate('/login-register');
      }
    }
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-light text-gray-900">
            Request a <span className="font-serif italic">Book</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Looking for a specific book or genre? Let us know and we'll do our best to bring it to you.
          </p>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden p-8 md:p-12"
        >
          <div className="space-y-6">
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
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default RequestBook;
