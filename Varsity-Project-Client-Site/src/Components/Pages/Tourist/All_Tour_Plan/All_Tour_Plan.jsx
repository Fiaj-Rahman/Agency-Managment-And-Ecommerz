import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaStar, FaUsers } from "react-icons/fa";

const All_Tour_Plan = () => {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: "",
    priceRange: "all",
    duration: "all",
    location: "all",
    sortBy: "newest"
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("https://varsity-project-server-site.vercel.app/tour");
        if (!response.ok) throw new Error("Failed to fetch tours");
        const data = await response.json();
        setTours(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredTours = tours.filter((tour) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tourEndDate = new Date(tour.endDate);
    tourEndDate.setHours(0, 0, 0, 0);

    // Calculate duration in days
    const durationDays = Math.ceil(
      (new Date(tour.endDate) - new Date(tour.startDate)) / (1000 * 60 * 60 * 24)
    );

    // Filter conditions
    return (
      tour.touristSpotName.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      tourEndDate >= today &&
      (filters.priceRange === "all" || (
        filters.priceRange === "0-5000" && tour.price <= 5000 ||
        filters.priceRange === "5001-10000" && tour.price > 5000 && tour.price <= 10000 ||
        filters.priceRange === "10001+" && tour.price > 10000
      )) &&
      (filters.duration === "all" || (
        filters.duration === "1-3" && durationDays <= 3 ||
        filters.duration === "4-7" && durationDays > 3 && durationDays <= 7 ||
        filters.duration === "8+" && durationDays > 7
      )) &&
      (filters.location === "all" || tour.district === filters.location)
    );
  });

  // Sort tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    if (filters.sortBy === "newest") {
      return new Date(b.startDate) - new Date(a.startDate);
    } else if (filters.sortBy === "price-low") {
      return a.price - b.price;
    } else if (filters.sortBy === "price-high") {
      return b.price - a.price;
    } else if (filters.sortBy === "duration") {
      return (new Date(b.endDate) - new Date(b.startDate)) - 
             (new Date(a.endDate) - new Date(a.startDate));
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Tours</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Discover Your Next Adventure</h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Explore our curated collection of premium tour packages across Bangladesh
        </p>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16">
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search destinations..."
              name="searchQuery"
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.searchQuery}
              onChange={handleFilterChange}
            />
          </div>

          {/* Price Range */}
          <select
            name="priceRange"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.priceRange}
            onChange={handleFilterChange}
          >
            <option value="all">All Prices</option>
            <option value="0-5000">Under ৳5,000</option>
            <option value="5001-10000">৳5,001 - ৳10,000</option>
            <option value="10001+">Over ৳10,000</option>
          </select>

          {/* Duration */}
          <select
            name="duration"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.duration}
            onChange={handleFilterChange}
          >
            <option value="all">All Durations</option>
            <option value="1-3">1-3 Days</option>
            <option value="4-7">4-7 Days</option>
            <option value="8+">8+ Days</option>
          </select>

          
          {/* Sort By */}
          <select
            name="sortBy"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Tour Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {sortedTours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No tours found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTours.map((tour) => (
              <Link 
                to={`/tour-plan/${tour._id}`}
                key={tour._id}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  {/* Image with overlay */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={tour.images[0]}
                      alt={tour.touristSpotName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                      ৳{tour.price.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Tour Info */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tour.touristSpotName}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {tour.touristSpotDetails?.slice(0, 100)}{tour.touristSpotDetails?.length > 100 && "..."}
                    </p>
                    
                    {/* Quick Facts */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                        {tour.district}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaUsers className="mr-2 text-gray-500" />
                        {tour.groupSize || "N/A"} people
                      </div>
                    </div>
                    
                    {/* Date Range */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center text-gray-700">
                          <FaCalendarAlt className="mr-2 text-gray-500" />
                          {format(new Date(tour.startDate), "dd MMM")} - {format(new Date(tour.endDate), "dd MMM")}
                        </div>
                        <div className="flex items-center">
                          <FaStar className="text-amber-400 mr-1" />
                          <span className="text-gray-700">{tour.rating || "New"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default All_Tour_Plan;