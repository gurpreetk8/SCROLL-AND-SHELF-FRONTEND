import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Heart } from 'lucide-react';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [replyContents, setReplyContents] = useState({});

  // Fetch post details, comments, and replies
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setError('You must be logged in to view this post.');
          setLoading(false);
          return;
        }

        // Get post details
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

        setComments(commentsResponse.data);

        // Initialize empty replies for each comment
        const initialReplies = {};
        commentsResponse.data.forEach(comment => {
          initialReplies[comment.id] = [];
        });
        setReplies(initialReplies);

      } catch (err) {
        console.error(err);
        setError('Failed to load post data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, token]);

  const fetchRepliesForComment = async (commentId) => {
    try {
      const response = await axios.get(
        `https://scrollandshelf.pythonanywhere.com/community/comments/${commentId}/replies/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReplies(prev => ({
        ...prev,
        [commentId]: response.data
      }));
    } catch (err) {
      console.error(`Error fetching replies for comment ${commentId}:`, err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `https://scrollandshelf.pythonanywhere.com/community/create_comment/${postId}/`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setComments(prev => [...prev, response.data.comment]);
        setNewComment('');
        // Initialize empty replies array for the new comment
        setReplies(prev => ({ ...prev, [response.data.comment.id]: [] }));
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyContents[commentId]?.trim()) return;

    try {
      const response = await axios.post(
        `https://scrollandshelf.pythonanywhere.com/community/create_reply/${commentId}/`,
        { content: replyContents[commentId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setReplies(prev => ({
          ...prev,
          [commentId]: [...prev[commentId], response.data.reply]
        }));
        setReplyContents(prev => ({ ...prev, [commentId]: '' }));
      }
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  const toggleLike = async () => {
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
        setPost(prev => ({
          ...prev,
          user_liked: !prev.user_liked,
          like_count: prev.user_liked ? prev.like_count - 1 : prev.like_count + 1
        }));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
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
        Back to Community
      </button>

      {/* Post Content */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Posted by <span className="font-medium">{post.user}</span> on{' '}
          {new Date(post.created_at).toLocaleDateString()}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="mt-4 rounded-lg w-full max-h-96 object-cover"
          />
        )}

        <p className="text-gray-700 mt-6 whitespace-pre-line">{post.content}</p>

        <div className="mt-6 flex items-center gap-4">
          <button 
            onClick={toggleLike}
            className="flex items-center gap-1 text-gray-600 hover:text-red-500"
          >
            <Heart 
              className={`w-5 h-5 ${post.user_liked ? 'fill-red-500 text-red-500' : ''}`} 
            />
            <span>{post.like_count}</span>
          </button>
          <div className="flex items-center gap-1 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>

      {/* Add Comment Section */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Comment</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Comments ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="space-y-6">
            {comments.map((comment) => (
              <li key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-gray-800">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      by {comment.user} • {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Replies Section */}
                {replies[comment.id] && replies[comment.id].length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                    {replies[comment.id].map((reply) => (
                      <div key={reply.id} className="py-3">
                        <p className="text-sm text-gray-700">↳ {reply.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          by {reply.user} • {new Date(reply.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Reply Section */}
                <div className="mt-4 pl-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyContents[comment.id] || ''}
                      onChange={(e) => setReplyContents(prev => ({
                        ...prev,
                        [comment.id]: e.target.value
                      }))}
                      placeholder="Write a reply..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddReply(comment.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostDetails;