import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Footer from '../components/layout/Footer';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="pt-16">
        <Hero />
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;