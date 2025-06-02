import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostDetails = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `https://scrollandshelf.pythonanywhere.com/community/posts/${post.id}/comments/`
        );
        setComments(res.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [post.id]);

  // Fetch replies
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await axios.get(
          'https://scrollandshelf.pythonanywhere.com/community/replies/'
        );
        setReplies(res.data);
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    fetchReplies();
  }, []);

  // Handle reply input changes
  const handleReplyChange = (commentId, value) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  // Submit reply
  const handleReplySubmit = async (commentId) => {
    const content = replyInputs[commentId];
    const token = localStorage.getItem('token');

    if (!content || !token) return;

    try {
      await axios.post(
        `https://scrollandshelf.pythonanywhere.com/community/create_reply/${commentId}/`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh replies
      const updatedReplies = await axios.get(
        'https://scrollandshelf.pythonanywhere.com/community/replies/'
      );
      setReplies(updatedReplies.data);

      // Clear input
      setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Posted by <span className="font-medium">{post.user}</span> on{' '}
          {new Date(post.created_at).toLocaleDateString()}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt="Post visual"
            className="mb-4 w-full rounded-lg object-cover max-h-80"
          />
        )}

        <p className="text-gray-700 mb-6">{post.content}</p>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-700 mb-2">
                    {comment.content}
                  </p>

                  {/* Replies */}
                  <ul className="ml-4 space-y-2">
                    {replies
                      .filter((reply) => reply.comment === comment.id)
                      .map((reply) => (
                        <li
                          key={reply.id}
                          className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                        >
                          ↳ {reply.content}
                        </li>
                      ))}
                  </ul>

                  {/* Reply input */}
                  <div className="mt-2 flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyInputs[comment.id] || ''}
                      onChange={(e) =>
                        handleReplyChange(comment.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded w-full text-sm"
                    />
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Reply
                    </button>
                  </div>
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
