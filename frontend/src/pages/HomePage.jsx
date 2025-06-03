import React from 'react';
import Navbar from '../components/HomePage/Navbar';
import HeroSection from '../components/HomePage/HeroSection';
import BestSellers from '../components/HomePage/BestSellers';
import BookOfTheMonth from '../components/HomePage/BookOfTheMonth';
import OurGenres from '../components/HomePage/OurGenres';
import TrendingBooks from '../components/HomePage/TrendingBooks';
import BookStats from '../components/HomePage/BookStats';
import RequestBookLanding from '../components/HomePage/RequestBookLanding';
import Footer from '../components/HomePage/Footer';


function HomePage() {
  return (
    <>
    <Navbar />
    <HeroSection /> 
    <BestSellers />
    <BookOfTheMonth/>
    <OurGenres />
    <TrendingBooks />
    
    <RequestBookLanding />
    <Footer /> 
    </>
  );
}

export default HomePage;