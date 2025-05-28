import React from 'react';
import Navbar from '../components/HomePage/Navbar';
import CommunityPage from '../components/Commuinty/CommunityPage';
import CommentPosts from '../components/Commuinty/CommentPosts';
import LikePosts from '../components/Commuinty/LikePosts';
import ReportPosts from '../components/Commuinty/ReportPosts';
import Footer from '../components/HomePage/Footer';

const Community = () => {
  const [activeTab, setActiveTab] = React.useState('community');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comments':
        return <CommentPosts />;
      case 'likes':
        return <LikePosts />;
      case 'reports':
        return <ReportPosts />;
      default:
        return <CommunityPage />;
    }
  };

  return (
    <>
    <Navbar />
        <div className="community-container">
        <div className="community-tabs">
            <button onClick={() => setActiveTab('community')}>Community</button>
            <button onClick={() => setActiveTab('comments')}>Comments</button>
            <button onClick={() => setActiveTab('likes')}>Likes</button>
            <button onClick={() => setActiveTab('user')}>User Posts</button>
            <button onClick={() => setActiveTab('reports')}>Reports</button>
        </div>
        
        <div className="community-content">
            {renderTabContent()}
        </div>
        </div>
        <Footer />
    </>
  );
};

export default Community;