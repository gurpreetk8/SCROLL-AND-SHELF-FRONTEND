import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, Download, BookOpen, Bookmark, 
  Sun, Moon, Search, List, 
  Settings, Type, Plus, Minus 
} from 'lucide-react';

const EbookReader = () => {
  // Main state
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Reader preferences state (for future features)
  const [preferences, setPreferences] = useState({
    nightMode: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    bookmarks: [],
    showToc: false,
    showSettings: false
  });

  const location = useLocation();
  const navigate = useNavigate();
  const ebookId = new URLSearchParams(location.search).get('id');

  // Fetch book data
  useEffect(() => {
    const fetchEbook = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'https://scrollandshelf.pythonanywhere.com/ebooks/ebook_detail/',
          { id: ebookId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          setEbook(response.data.ebook);
        } else {
          setError(response.data.message || 'Failed to load book');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    if (ebookId) fetchEbook();
  }, [ebookId]);

  // Toggle night mode
  const toggleNightMode = () => {
    setPreferences(prev => ({
      ...prev,
      nightMode: !prev.nightMode
    }));
  };

  // Placeholder functions for future features
  const addBookmark = () => {
    /* To be implemented */
    console.log('Adding bookmark');
  };

  const toggleToc = () => {
    setPreferences(prev => ({
      ...prev,
      showToc: !prev.showToc
    }));
  };

  const adjustFontSize = (increase) => {
    setPreferences(prev => ({
      ...prev,
      fontSize: Math.min(24, Math.max(12, 
        prev.fontSize + (increase ? 1 : -1)
      ))
    }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-medium text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Safety
          </button>
        </div>
      </div>
    );
  }

  if (!ebook) return null;

  return (
    <div className={`fixed inset-0 flex flex-col z-50 ${
      preferences.nightMode ? 'bg-gray-900 text-gray-100' : 'bg-white'
    }`}>
      
      {/* Header */}
      <header className={`flex items-center justify-between p-4 ${
        preferences.nightMode ? 'bg-gray-800' : 'bg-gray-900 text-white'
      }`}>
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h1 className="text-lg font-medium truncate max-w-xs md:max-w-md">
          {ebook.title}
        </h1>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleNightMode}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {preferences.nightMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          <a
            href={`https://scrollandshelf.pythonanywhere.com/${ebook.file_url}`}
            download
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <Download className="h-5 w-5" />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents (Collapsible) */}
        {preferences.showToc && (
          <div className={`w-64 border-r overflow-y-auto ${
            preferences.nightMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-4">
              <h3 className="font-medium flex items-center">
                <List className="h-4 w-4 mr-2" />
                Table of Contents
              </h3>
              {/* TOC items would go here */}
              <div className="mt-4 text-sm text-gray-500">
                TOC feature coming soon
              </div>
            </div>
          </div>
        )}

        {/* Reader Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className={`flex items-center justify-between p-2 border-b ${
            preferences.nightMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex space-x-2">
              <button
                onClick={toggleToc}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <List className="h-5 w-5" />
              </button>
              
              <button
                onClick={addBookmark}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => adjustFontSize(false)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Minus className="h-4 w-4" />
                </button>
                
                <span className="text-sm w-8 text-center">
                  {preferences.fontSize}px
                </span>
                
                <button 
                  onClick={() => adjustFontSize(true)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <select
                value={preferences.fontFamily}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  fontFamily: e.target.value
                }))}
                className={`text-sm rounded border ${
                  preferences.nightMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans-serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>
          </div>
          
          {/* Actual Book Content */}
          <div className="flex-1 overflow-auto">
            {ebook.file_url?.endsWith('.pdf') ? (
              <iframe 
                src={`https://scrollandshelf.pythonanywhere.com/${ebook.file_url}#view=fitH`}
                className="w-full h-full border-0"
                title={ebook.title}
              />
            ) : (
              <div className={`p-8 max-w-4xl mx-auto ${
                preferences.nightMode ? 'text-gray-100' : 'text-gray-800'
              }`}
              style={{
                fontSize: `${preferences.fontSize}px`,
                fontFamily: preferences.fontFamily
              }}>
                <div className="prose dark:prose-invert max-w-none">
                  <h1>{ebook.title}</h1>
                  <h2>by {ebook.author}</h2>
                  <p className="opacity-75">
                    Online reading feature for this format is coming soon. 
                    Please download the book to read it now.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookReader;