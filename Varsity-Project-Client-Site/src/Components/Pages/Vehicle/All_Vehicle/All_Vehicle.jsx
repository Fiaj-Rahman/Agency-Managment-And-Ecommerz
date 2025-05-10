import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCar, FaGasPump, FaUsers, FaSearch, FaStar,FaMapMarkerAlt  } from "react-icons/fa";
import { GiGearStickPattern } from "react-icons/gi";

const All_Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    vehicleType: "all",
    transmission: "all",
    fuelType: "all",
    maxPrice: "",
    searchQuery: "",
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("https://varsity-project-server-site.vercel.app/vehicles");
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    return (
      (filters.vehicleType === "all" || vehicle.vehicleType === filters.vehicleType) &&
      (filters.transmission === "all" || vehicle.transmission === filters.transmission) &&
      (filters.fuelType === "all" || vehicle.fuelType === filters.fuelType) &&
      (filters.maxPrice === "" || vehicle.pricePerDay <= filters.maxPrice) &&
      (vehicle.vehicleName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
       vehicle.location.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < (rating || 0) ? 'text-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading vehicles...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Explore Our Premium Fleet</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover the perfect vehicle for your next adventure from our curated collection
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-12">
        <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or location"
              name="searchQuery"
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={handleFilterChange}
            />
          </div>
          
          <select
            name="vehicleType"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleFilterChange}
          >
            <option value="all">All Vehicle Types</option>
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="SUV">SUV</option>
          </select>
          
          <select
            name="transmission"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleFilterChange}
          >
            <option value="all">All Transmissions</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
          
          <select
            name="fuelType"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleFilterChange}
          >
            <option value="all">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
          
          <input
            type="number"
            placeholder="Max price/day"
            name="maxPrice"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No vehicles found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link to={`/vehicle/${vehicle._id}`} className="block">
                  {/* Image with badge */}
                  <div className="relative">
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.vehicleName}
                      className="w-full h-56 object-cover"
                    />
                    {vehicle.isFeatured && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Vehicle Info */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{vehicle.vehicleName}</h2>
                      <div className="text-lg font-semibold text-blue-600">
                        {vehicle.pricePerDay.toLocaleString()}৳<span className="text-sm text-gray-500">/day</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <span className="font-medium">{vehicle.brand}</span>
                      <span className="mx-2">•</span>
                      <span>{vehicle.model}</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      {renderStars(vehicle.rating)}
                      <span className="ml-2 text-sm text-gray-500">({vehicle.reviews || 0})</span>
                    </div>
                    
                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <FaCar className="mr-2 text-gray-500" />
                        {vehicle.vehicleType}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <GiGearStickPattern className="mr-2 text-gray-500" />
                        {vehicle.transmission}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaGasPump className="mr-2 text-gray-500" />
                        {vehicle.fuelType}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaUsers className="mr-2 text-gray-500" />
                        {vehicle.seats} seats
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 pt-3 border-t border-gray-100">
                      <FaMapMarkerAlt className="mr-2 text-gray-400" />
                      {vehicle.location}, {vehicle.district}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default All_Vehicle;