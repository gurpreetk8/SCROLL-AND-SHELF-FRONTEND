import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const CommunityPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) {
        setError('You must be logged in to view posts.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'https://scrollandshelf.pythonanywhere.com/community/posts/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setPosts(response.data.posts);
        } else {
          setError(response.data.message || 'Failed to load posts.');
        }
      } catch (err) {
        setError('An error occurred while fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const handleLikeToggle = async (postId) => {
    try {
      const response = await axios.post(
        `https://scrollandshelf.pythonanywhere.com/community/toggle_like/${postId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  like_count: post.user_liked ? post.like_count - 1 : post.like_count + 1,
                  user_liked: !post.user_liked,
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Text */}
        <h1 className="ml-2 text-3xl font-medium tracking-widest text-gray-600 mb-4">
          🛋️ Reader's Lounge
        </h1>

        <div className="grid gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition"
            >
              {/* Post Header */}
              <div className="mb-2 text-sm text-gray-500">
                Posted by <span className="font-medium text-gray-700">{post.user}</span> on{' '}
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              {/* Post Title */}
              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>

              {/* Optional Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post visual"
                  className="my-4 w-full rounded-lg max-h-80 object-cover"
                />
              )}

              {/* Post Content */}
              <p className="text-gray-700 mt-2">{post.content}</p>

              {/* Reactions */}
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                <button
                  onClick={() => handleLikeToggle(post.id)}
                  className="flex items-center gap-1 focus:outline-none"
                >
                  <Heart
                    className={`w-4 h-4 transition ${
                      post.user_liked ? 'text-red-500 fill-red-500' : 'hover:text-red-400'
                    }`}
                  />
                  <span>{post.like_count}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPosts;
