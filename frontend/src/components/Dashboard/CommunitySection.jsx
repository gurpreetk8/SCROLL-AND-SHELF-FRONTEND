import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login-register');
      return;
    }

    axios
      .get('https://scrollandshelf.pythonanywhere.com/community/list_posts_by_user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.posts.length > 0) {
          setPosts(res.data.posts);
        } else {
          navigate('/community');
        }
      })
      .catch((error) => {
        console.error('Error fetching user posts:', error);
        navigate('/community');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, navigate]);

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading your posts...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">My Community Posts</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{new Date(post.created_at).toLocaleString()}</p>
            <p className="text-gray-700 mb-3 line-clamp-4">{post.content}</p>
            {post.image && (
              <img
                src={`https://scrollandshelf.pythonanywhere.com${post.image}`}
                alt="Post"
                className="rounded-lg mt-2 max-h-60 object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
