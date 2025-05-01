import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BookOpen, Download, ArrowLeft, Bookmark, Share2, Star } from 'lucide-react';
import Footer from '../components/HomePage/Footer';
import Navbar from '../components/HomePage/Navbar';


const EbookDetail = () => {
  const [ebook, setEbook] = useState(null);
  const [latestEbooks, setLatestEbooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

    const fetchLatestEbooks = async () => {
      try {
        const response = await axios.get(
          'https://scrollandshelf.pythonanywhere.com/ebooks/latest_ebooks/'
        );
        if (response.data.success) {
          setLatestEbooks(response.data.ebooks);
        }
      } catch (err) {
        console.error('Error fetching latest ebooks:', err);
      }
    };

    fetchEbookDetails();
    fetchLatestEbooks();
  }, [ebookId]);

  if (loading) return <div className="p-6 text-lg">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!ebook) return null;

  return (
    <div className="p-6 md:flex gap-10">
      <Navbar />
      <motion.div
        className="md:w-1/2 mb-6 md:mb-0"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={ebook.cover_image}
          alt={ebook.title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </motion.div>

      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-3">{ebook.title}</h1>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Author:</span> {ebook.author}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Category:</span> {ebook.category}
        </p>
        <p className="text-gray-600 mb-3">
          <span className="font-semibold">Uploaded on:</span>{' '}
          {new Date(ebook.uploaded_at).toLocaleDateString()}
        </p>
        <p className="text-gray-800 mb-5">{ebook.description}</p>

        {ebook.file_url && (
          <a
            href={ebook.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Read Full Book
          </a>
        )}
      </motion.div>

      {ebook.preview_images?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ebook.preview_images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Preview ${index + 1}`}
                className="w-full h-auto rounded shadow"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Latest Ebooks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {latestEbooks.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded p-2 hover:shadow-lg transition"
            >
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-full h-40 object-cover rounded"
              />
              <p className="mt-2 text-sm font-medium text-gray-800">{book.title}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default EbookDetail;
