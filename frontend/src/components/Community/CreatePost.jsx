import React, { useState } from 'react';
import axios from 'axios';
import { Image as ImageIcon } from 'lucide-react';

const CreatePost = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);

      await axios.post(
        'https://scrollandshelf.pythonanywhere.com/community/create_post/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setTitle('');
      setContent('');
      setImage(null);
      setPreviewUrl(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border px-4 py-2 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your post..."
          className="w-full border px-4 py-2 rounded-md h-32 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* Custom Image Upload */}
        <div className="flex items-center gap-4">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">
              {image ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-12 w-12 object-cover rounded-md border"
            />
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
