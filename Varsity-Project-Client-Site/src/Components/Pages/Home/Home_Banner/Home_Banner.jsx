// Home_Banner.jsx
import React from "react";
import { FaSearch } from "react-icons/fa";

const Home_Banner = () => {
  return (
    <div className="relative h-screen bg-gray-900">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
          alt="Luxury Hotel"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Premium Hospitality Solutions
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Connecting you with the best hotel management, transportation, and tourism services
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search destinations, hotels, or services..."
              className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <FaSearch className="text-lg" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home_Banner;