import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Vehicle_Section = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5000/vehicles");
        const data = await response.json();
        const shuffledData = data.sort(() => Math.random() - 0.5);
        setVehicles(shuffledData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Premium Vehicle Collection
      </h1>
      <p className="text-gray-600 text-lg">Experience Luxury on Wheels</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {vehicles.map((vehicle) => (
        <div 
          key={vehicle._id}
          className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-out overflow-hidden"
        >
          <Link to={`vehicle/${vehicle._id}`}>
          <div className="relative overflow-hidden">
            <img
              src={vehicle.images[0] || "https://via.placeholder.com/300"}
              alt={vehicle.vehicleName}
              className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
              {vehicle.status === 'available' ? 
                <span className="text-green-600">Available</span> : 
                <span className="text-red-600">Booked</span>}
            </span>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">{vehicle.vehicleName}</h2>
              <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                ★ {vehicle.rating || 'New'}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
              <span>{vehicle.location}</span>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-bold text-blue-600">
                  ${vehicle.pricePerDay.toLocaleString()}<span className="text-sm text-gray-500">/day</span>
                </p>
                <span className="text-sm bg-gray-800 px-2 py-1 rounded">
                  {vehicle.seats} Seats
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 text-sm rounded-full">
                  {vehicle.vehicleType}
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 text-sm rounded-full">
                  {vehicle.fuelType}
                </span>
              </div>
            </div>
          </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
</div>
  );
};

export default Vehicle_Section;