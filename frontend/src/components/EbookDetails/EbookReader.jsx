import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { X, Download, BookOpen } from 'lucide-react';

const EbookReader = () => {
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const ebookId = queryParams.get('id');

  useEffect(() => {
    const fetchEbookDetails = async () => {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to read books. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        console.log('Fetching ebook details for ID:', ebookId);
        const response = await axios.post(
          'https://scrollandshelf.pythonanywhere.com/ebooks/ebook_detail/',
          { id: ebookId },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            timeout: 10000 // 10 second timeout
          }
        );

        console.log('API Response:', response.data);
        
        if (response.data.success) {
          setEbook(response.data.ebook);
        } else {
          setError(response.data.message || 'Failed to load book details.');
        }
      } catch (err) {
        console.error('Error fetching ebook:', err);
        let errorMessage = 'Error loading book.';
        
        if (err.response) {
          // Server responded with error status
          errorMessage = err.response.data.message || `Server error: ${err.response.status}`;
        } else if (err.request) {
          // Request was made but no response
          errorMessage = 'No response from server. Please check your connection.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEbookDetails();
  }, [ebookId, retryCount, navigate]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading book details...</p>
        <p className="text-sm text-gray-500 mt-2">Book ID: {ebookId}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 p-6">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-medium text-red-600 mb-2">Error Loading Book</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-2">Book Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          <h1 className="text-xl font-medium truncate max-w-xs">{ebook.title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href={`https://scrollandshelf.pythonanywhere.com/${ebook.file_url}`}
            download
            className="flex items-center text-white hover:text-gray-300"
          >
            <Download className="h-5 w-5" />
          </a>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        {ebook.file_url?.endsWith('.pdf') ? (
          <iframe 
            src={`https://scrollandshelf.pythonanywhere.com/${ebook.file_url}#view=fitH`}
            className="w-full h-full border-0"
            title={ebook.title}
            onLoad={() => console.log('PDF loaded successfully')}
            onError={(e) => {
              console.error('PDF load error:', e);
              setError('Failed to load PDF content.');
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="max-w-2xl mx-auto text-center">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-medium mb-2">No Preview Available</h2>
              <p className="text-gray-600 mb-6">
                This book format cannot be displayed in the browser. Please download it to read.
              </p>
              <a
                href={`https://scrollandshelf.pythonanywhere.com/${ebook.file_url}`}
                download
                className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Book
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookReader;