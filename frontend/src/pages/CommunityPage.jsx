// pages/CommunityPage.js

import React, { useState } from 'react';
import Navbar from '../components/HomePage/Navbar';
import Footer from '../components/HomePage/Footer';

import CommunityHero from '../components/Community/CommunityHero';
import CommunityPost from '../components/Community/CommunityPost';
import PostDetails from '../components/Community/PostDetails'; // Make sure this path is correct

const CommunityPage = () => {
  const [selectedPost, setSelectedPost] = useState(null); // For post detail modal

  return (
    <>
      <Navbar />

      <div className="pt-20"> {/* Padding from navbar */}
        <CommunityHero />

        <CommunityPosts setSelectedPost={setSelectedPost} />

        {selectedPost && (
          <PostDetails
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </div>

      <Footer />
    </>
  );
};

export default CommunityPage;
