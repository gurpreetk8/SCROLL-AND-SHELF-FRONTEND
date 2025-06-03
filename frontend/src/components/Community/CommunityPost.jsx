import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CommunityPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          'https://scrollandshelf.pythonanywhere.com/users/user_details/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setUsername(response.data.user_details.username);
        }
      } catch (err) {
        console.error('Failed to fetch user details');
      }
    };

    const fetchPosts = async () => {
      if (!token) {
        setError('You must be logged in to view posts.');
        setLoading(false);
        return;
      }

      await fetchUserDetails();

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

  const handleLikeToggle = async (postId, e) => {
    e.stopPropagation();
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

  const handlePostClick = (postId) => {
    navigate(`/community/posts/${postId}`);
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
        <h1 className="ml-2 text-3xl font-medium tracking-widest text-gray-600 mb-4">
          💬 Reader's Lounge
        </h1>

        <div className="mb-6 text-gray-700 text-sm">Welcome, <span className="font-semibold">{username}</span>!</div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition cursor-pointer"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="mb-2 text-sm text-gray-500">
                Posted by <span className="font-medium text-gray-700">
                  {post.user?.username || post.user?.first_name || post.user?.email?.split('@')[0] || 'User'}
                </span> on{' '}
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>

              {post.image && (
                <div className="my-4 overflow-hidden rounded-lg bg-gray-100 flex justify-center">
                  <img
                    src={post.image}
                    alt="Post visual"
                    className="max-h-[500px] w-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              
              <p className="text-gray-700 mt-2">{post.content}</p>

              <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                <button
                  onClick={(e) => handleLikeToggle(post.id, e)}
                  className="flex items-center gap-1 focus:outline-none"
                >
                  <Heart
                    className={`w-4 h-4 transition ${
                      post.user_liked ? 'text-red-500 fill-red-500' : 'hover:text-red-400'
                    }`}
                  />
                  <span>{post.like_count}</span>
                </button>
                <div 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePostClick(post.id);
                  }}
                >
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

export default CommunityPost;
