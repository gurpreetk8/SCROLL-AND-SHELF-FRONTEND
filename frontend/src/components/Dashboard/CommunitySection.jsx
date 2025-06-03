import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiMessageCircle } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/community/";
  const token = localStorage.getItem("token");

  const fetchMyPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(`${API_BASE_URL}my-posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPosts(res.data.posts || []);
      } else {
        setError(res.data.message || "Failed to fetch posts.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load your posts. Try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyPosts();
    else {
      setError("No authentication token found");
      setIsLoading(false);
    }
  }, [token]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handlePostClick = (id) => {
    navigate(`/community/post/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-600"
      >
        <p className="font-medium">Error:</p>
        <p>{error}</p>
        <button
          onClick={fetchMyPosts}
          className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl shadow-xl p-6"
    >
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-3 rounded-xl mr-4">
          <FiEdit2 className="text-blue-600 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Posts</h2>
          <p className="text-gray-500">Posts you’ve shared with the community</p>
        </div>
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-600 mb-4"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => handlePostClick(post.id)}
              className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition rounded-lg p-4 shadow border border-gray-100"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">{post.title}</h3>
                <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FiMessageCircle className="h-4 w-4" />
                  {post.comment_count} Comments
                </span>
                <span className="flex items-center gap-1">
                  ❤️ {post.likes_count} Likes
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">You haven’t posted anything yet.</p>
      )}
    </motion.div>
  );
}
