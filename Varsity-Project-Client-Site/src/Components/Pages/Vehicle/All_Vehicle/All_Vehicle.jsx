import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">All Vehicles</h1>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 p-4 bg-gray-100 rounded-lg">
        <input
          type="text"
          placeholder="Search by name or location"
          name="searchQuery"
          className="p-2 border rounded"
          onChange={handleFilterChange}
        />
        <select
          name="vehicleType"
          className="p-2 border rounded"
          onChange={handleFilterChange}
        >
          <option value="all">All Types</option>
          <option value="Car">Car</option>
          <option value="Motorcycle">Motorcycle</option>
          <option value="SUV">SUV</option>
        </select>
        
        <select
          name="transmission"
          className="p-2 border rounded"
          onChange={handleFilterChange}
        >
          <option value="all">All Transmissions</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
        
        <select
          name="fuelType"
          className="p-2 border rounded"
          onChange={handleFilterChange}
        >
          <option value="all">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
        
        <input
          type="number"
          placeholder="Max price per day"
          name="maxPrice"
          className="p-2 border rounded"
          onChange={handleFilterChange}
        />
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center text-gray-500">No vehicles found matching your criteria</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/vehicle/${vehicle._id}`}>
              <img
                src={vehicle.images[0]}
                alt={vehicle.vehicleName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{vehicle.vehicleName}</h2>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">{vehicle.brand}</span>
                  <span className="font-bold">${vehicle.pricePerDay}/day</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <p>{vehicle.location}, {vehicle.district}</p>
                  <p>{vehicle.seats} seats • {vehicle.transmission}</p>
                </div>
              </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default All_Vehicle;