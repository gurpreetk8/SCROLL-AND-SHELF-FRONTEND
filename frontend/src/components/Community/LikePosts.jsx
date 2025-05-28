import React, { useState, useEffect } from 'react';


const LikePosts = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [userId, setUserId] = useState('');

  const fetchLikes = async () => {
    if (!userId) return;
    
    try {
      const response = await getLikesByUser(userId);
      setLikedPosts(response);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await toggleLike(postId);
      // Refresh the list after toggling like
      fetchLikes();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="like-posts">
      <h2>Liked Posts</h2>
      <div className="like-controls">
        <input
          type="text"
          placeholder="Enter User Email"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={fetchLikes}>Load Likes</button>
      </div>

      {likedPosts.length > 0 ? (
        <div className="likes-list">
          {likedPosts.map(like => (
            <div key={like.id} className="like-item">
              <h3>{like.post.title}</h3>
              <button onClick={() => handleLike(like.post.id)}>
                {like.is_liked ? 'Unlike' : 'Like'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No liked posts found or no user ID entered.</p>
      )}
    </div>
  );
};

export default LikePosts;