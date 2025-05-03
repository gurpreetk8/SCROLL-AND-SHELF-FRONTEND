import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, ChevronLeft, ChevronRight, BookOpen, Download, 
  Bookmark, Sun, Moon, Search, List 
} from 'lucide-react';

const EbookReader = () => {
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    fontSize: 16,
    fontFamily: 'serif',
    nightMode: false,
    // Future settings can be added here
  });
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const ebookId = queryParams.get('id');

  // Fetch book data
  useEffect(() => {
    const fetchEbookDetails = async () => {
      // ... existing fetch code ...
    };
    fetchEbookDetails();
  }, [ebookId]);

  // Future: Load saved bookmarks and preferences
  useEffect(() => {
    // Load from localStorage:
    const savedSettings = localStorage.getItem('readerSettings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    
    // Load bookmarks for this book
    // const savedBookmarks = localStorage.getItem(`bookmarks-${ebookId}`);
  }, [ebookId]);

  // Future: Save settings
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('readerSettings', JSON.stringify(updated));
  };

  // Future: Bookmark functionality
  const handleBookmark = () => {
    // Save current page/position to bookmarks
    // localStorage.setItem(`bookmarks-${ebookId}`, ...);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (!ebook) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden flex flex-col 
      ${settings.nightMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100'}`}>
      
      {/* Enhanced Header */}
      <header className={`p-4 flex justify-between items-center
        ${settings.nightMode ? 'bg-gray-800' : 'bg-gray-900 text-white'}`}>
        
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-700">
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-medium truncate max-w-xs">{ebook.title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Future: Search button */}
          <button 
            onClick={() => {/* Implement search modal */}}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <Search className="h-5 w-5" />
          </button>
          
          {/* Night mode toggle */}
          <button 
            onClick={() => updateSettings({ nightMode: !settings.nightMode })}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {settings.nightMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {/* Download button */}
          <a 
            href={`https://scrollandshelf.pythonanywhere.com/${ebook.file_url}`}
            download
            className="flex items-center hover:text-gray-300"
          >
            <Download className="h-5 w-5" />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Future: Table of Contents sidebar */}
        <div className={`w-64 border-r p-4 overflow-y-auto
          ${settings.nightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="font-medium mb-4 flex items-center">
            <List className="h-4 w-4 mr-2" /> Table of Contents
          </h3>
          {/* TOC items would be rendered here */}
          <div className="text-sm text-gray-500">TOC will be implemented later</div>
        </div>

        {/* Reading Area */}
        <div className="flex-1 flex flex-col">
          {/* Future: Text customization toolbar */}
          <div className={`p-2 border-b flex items-center space-x-4
            ${settings.nightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <select 
              value={settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
              className="bg-transparent border rounded px-2 py-1 text-sm"
            >
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans-serif</option>
              <option value="monospace">Monospace</option>
            </select>
            <div className="flex items-center space-x-2">
              <button onClick={() => updateSettings({ fontSize: Math.max(12, settings.fontSize - 1) })}>
                A-
              </button>
              <span className="text-sm w-8 text-center">{settings.fontSize}px</span>
              <button onClick={() => updateSettings({ fontSize: Math.min(24, settings.fontSize + 1) })}>
                A+
              </button>
            </div>
          </div>

          {/* Book Content */}
          <div 
            className="flex-1 overflow-auto p-8"
            style={{
              fontSize: `${settings.fontSize}px`,
              fontFamily: settings.fontFamily,
              ...(settings.nightMode && { backgroundColor: '#1a202c', color: '#e2e8f0' })
            }}
          >
            {ebook.file_url?.endsWith('.pdf') ? (
              <iframe 
                src={`https://scrollandshelf.pythonanywhere.com/${ebook.file_url}#view=fitH`}
                className="w-full h-full border-0"
                title={ebook.title}
              />
            ) : (
              <div className="max-w-2xl mx-auto">
                {/* Future: Actual book content rendering */}
                <p className="mb-4">Book content will be rendered here.</p>
                {/* Future: Search results would appear here */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className={`p-2 border-t flex items-center justify-between
        ${settings.nightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        
        <button 
          onClick={handleBookmark}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Bookmark className="h-5 w-5" />
        </button>
        
        {/* Future: Page navigation would go here */}
        <div className="text-sm">
          Page 1 of 1
        </div>
      </div>

      {/* Future: Search modal would appear here conditionally */}
    </div>
  );
};

// Helper components
const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-pulse text-gray-500">Loading book...</div>
  </div>
);

const ErrorScreen = ({ error }) => (
  <div className="text-center text-red-500 p-8">
    Error: {error}
  </div>
);

export default EbookReader;