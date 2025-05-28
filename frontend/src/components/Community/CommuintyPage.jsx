import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../services/postService';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        setPosts(response.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="community-page">
      <h2>Community Posts</h2>
      {posts.length > 0 ? (
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt={post.title} />}
              <div className="post-meta">
                <span>Posted by: {post.user}</span>
                <span>Date: {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default CommunityPage;