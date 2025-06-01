// pages/CommunityPage.js
import react from 'react';
import CommunityHero from '../components/Community/CommunityHero';
import CommunityPost from '../components/Community/CommunityPost';

import Navbar from '../components/HomePage/Navbar';


function CommunityPage() {
    return (
        <>
        <Navbar />
        <CommunityHero />
        
        <CommunityPost />
        
        </> 
            
     
    
  );
};

export default CommunityPage;