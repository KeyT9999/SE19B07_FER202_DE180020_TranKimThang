/**
 * HomePage Component
 * Main home page with hero, AI search, intro, featured restaurants, categories, and footer CTA
 */

import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AISearch from '../components/home/AISearch';
import IntroSection from '../components/home/IntroSection';
import FeaturedRestaurants from '../components/home/FeaturedRestaurants';
import CategoriesSection from '../components/home/CategoriesSection';
import FooterCTA from '../components/home/FooterCTA';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <AISearch />
      <IntroSection />
      <FeaturedRestaurants />
      <CategoriesSection />
      <FooterCTA />
    </div>
  );
}

export default HomePage;

