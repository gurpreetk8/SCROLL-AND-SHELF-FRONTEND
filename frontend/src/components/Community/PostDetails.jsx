import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageSquare } from 'lucide-react';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [commentStatus, setCommentStatus] = useState('');

  // Fetch post details and comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        if (!token) {
          setError('You must be logged in to view this post.');
          setLoading(false);
          return;
        }

        // Get post details from community/posts/ endpoint
        const postResponse = await axios.get(
          `https://scrollandshelf.pythonanywhere.com/community/posts/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const selectedPost = postResponse.data.posts.find((p) => p.id === parseInt(postId));
        if (!selectedPost) {
          setError('Post not found.');
          setLoading(false);
          return;
        }

        setPost(selectedPost);

        // Get comments for this post
        const commentsResponse = await axios.get(
          `https://scrollandshelf.pythonanywhere.com/community/posts/${postId}/comments/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Ensure comments is always an array
        const commentsData = Array.isArray(commentsResponse.data.comments) 
          ? commentsResponse.data.comments 
          : Array.isArray(commentsResponse.data)
            ? commentsResponse.data
            : [];
            
        setComments(commentsData);
      } catch (err) {
        console.error(err);
        setError('Failed to load post or comments.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId, token]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      const response = await axios.post(
        `https://scrollandshelf.pythonanywhere.com/community/create_comment/${postId}/`,
        { content: commentInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setComments([...comments, response.data.comment]);
        setCommentInput('');
        setCommentStatus('Comment posted successfully!');
        setTimeout(() => setCommentStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      setCommentStatus('Failed to post comment.');
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Posted by <span className="font-medium">{post.user}</span> on{' '}
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-gray-500">
              <Heart className="w-5 h-5" />
              <span>{post.like_count}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <MessageSquare className="w-5 h-5" />
              <span>{comments.length}</span>
            </div>
          </div>
        </div>

        {post.image && (
          <div className="mt-6 mb-6 overflow-hidden rounded-lg bg-gray-100 flex justify-center">
            <img
              src={post.image}
              alt="Post"
              className="max-h-[70vh] w-auto object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <p className="text-gray-700 mt-6">{post.content}</p>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mt-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Post
            </button>
          </div>
          {commentStatus && (
            <p className={`text-sm mt-2 ${commentStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
              {commentStatus}
            </p>
          )}
        </form>

        {/* Comments Section */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Comments ({comments.length})
          </h3>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">
                      {comment.user?.first_name || comment.user?.email || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;