import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const EbookDetail = () => {
  const [ebook, setEbook] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();

  // Extract bookId from query string
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get('id');

  useEffect(() => {
    const fetchEbookDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view book details.');
        return;
      }

      if (!bookId) {
        setError('Invalid book ID.');
        return;
      }

      try {
        const res = await fetch('https://scrollandshelf.pythonanywhere.com/ebooks/ebook_detail/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ id: bookId }),
        });

        const data = await res.json();

        if (!data.success) {
          setError(data.message);
        } else {
          setEbook(data.ebook);
        }

      } catch (err) {
        setError('Server error while fetching ebook details.');
      }
    };

    fetchEbookDetails();
  }, [bookId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!ebook) return <div>Loading...</div>;

  return (
    <div className="p-4 rounded shadow-md">
      <h2 className="text-xl font-bold">{ebook.title}</h2>
      <p className="text-gray-700">Author: {ebook.author}</p>
      <img src={ebook.cover_image} alt={ebook.title} className="w-40 my-2 rounded" />
      <p>{ebook.description}</p>
      {ebook.file_url && (
        <a href={ebook.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 block">
          Read Full Book
        </a>
      )}
    </div>
  );
};

export default EbookDetail;
