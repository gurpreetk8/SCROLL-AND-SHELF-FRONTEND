import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Main CommunityPosts Component
const CommunityPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [commentStatus, setCommentStatus] = useState({});
  const navigate = useNavigate();

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

  const handleCommentChange = (postId, value, e) => {
    e.stopPropagation();
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId, e) => {
    e.stopPropagation();
    const content = commentInputs[postId];
    if (!content) return;

    try {
      const response = await axios.post(
        `https://scrollandshelf.pythonanywhere.com/community/create_comment/${postId}/`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setCommentStatus((prev) => ({ ...prev, [postId]: 'Comment posted!' }));
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [...post.comments, response.data.comment],
                }
              : post
          )
        );
      } else {
        setCommentStatus((prev) => ({ ...prev, [postId]: 'Failed to post comment.' }));
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      setCommentStatus((prev) => ({ ...prev, [postId]: 'Error posting comment.' }));
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
                Posted by <span className="font-medium text-gray-700">{post.user}</span> on{' '}
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post visual"
                  className="my-4 w-full rounded-lg max-h-80 object-cover"
                />
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
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length}</span>
                </div>
              </div>

              <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => handleCommentChange(post.id, e.target.value, e)}
                  placeholder="Write a comment..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  onClick={(e) => handleCommentSubmit(post.id, e)}
                  className="mt-2 px-4 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition"
                >
                  Post Comment
                </button>
                {commentStatus[post.id] && (
                  <p className="text-xs mt-1 text-gray-500">{commentStatus[post.id]}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPost;