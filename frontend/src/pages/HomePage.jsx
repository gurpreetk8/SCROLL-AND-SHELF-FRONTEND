import React from 'react';
import Navbar from '../components/HomePage/Navbar';
import HeroSection from '../components/HomePage/HeroSection';
import BestSellers from '../components/HomePage/BestSellers';
import BookOfTheMonth from '../components/HomePage/BookOfTheMonth';
import OurGenres from '../components/HomePage/OurGenres';
import TrendingBooks from '../components/HomePage/TrendingBooks';
import BookStats from '../components/HomePage/BookStats';
import RequestBook from '../components/HomePage/RequestBook';
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
    <BookStats />
    <RequestBook />
    <Footer /> 
    </>
  );
}

export default HomePage;