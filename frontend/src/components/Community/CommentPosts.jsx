import React, { useState, useEffect } from 'react';


const CommentPosts = () => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');

  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      const response = await getPostComments(postId);
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  return (
    <div className="comment-posts">
      <h2>Post Comments</h2>
      <div className="comment-controls">
        <input
          type="text"
          placeholder="Enter Post ID"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
        />
        <button onClick={fetchComments}>Load Comments</button>
      </div>

      {comments.length > 0 ? (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <p>{comment.content}</p>
              <div className="comment-meta">
                <span>By: {comment.user}</span>
                <span>Date: {new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No comments found or no post ID entered.</p>
      )}
    </div>
  );
};

export default CommentPosts;