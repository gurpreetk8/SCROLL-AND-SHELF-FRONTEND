import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserPosts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'https://scrollandshelf.pythonanywhere.com/community/list_posts_by_user/',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        if (response.data.posts.length === 0) {
          navigate('/community');
        } else {
          setPosts(response.data.posts);
        }
      } else {
        setError(response.data.message || 'Failed to fetch posts');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `https://scrollandshelf.pythonanywhere.com/community/delete_post/${postId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        fetchUserPosts(); // Refresh the list after deletion
      } else {
        setError(response.data.message || 'Failed to delete post');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting post');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg max-w-4xl mx-auto my-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Community
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Your Posts</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">You haven't created any posts yet.</p>
          <button
            onClick={() => navigate('/community/create-post')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              {post.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/community/edit-post/${post.id}`)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                      title="Edit post"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                      title="Delete post"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 whitespace-pre-line">{post.content}</p>
                <div className="text-sm text-gray-500">
                  Posted on {formatDate(post.created_at)}
                  {post.created_at !== post.updated_at && (
                    <span> • Last updated {formatDate(post.updated_at)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;