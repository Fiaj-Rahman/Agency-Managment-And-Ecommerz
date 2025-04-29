import React, { useState, useEffect } from "react";

const Hotel_Section = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:5000/hotel");
        const data = await response.json();
        const shuffledData = data.sort(() => Math.random() - 0.5);
        setHotels(shuffledData);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Luxury Accommodations
          </h1>
          <p className="text-gray-600 text-lg">Experience Premium Hospitality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {hotels.map((hotel) => (
            <div 
              key={hotel._id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={hotel.images[0] || "https://via.placeholder.com/300"}
                  alt={hotel.hotelName}
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                    {hotel.status === 'available' ? 
                      <span className="text-green-600">★ Available</span> : 
                      <span className="text-red-600">⛔ Booked</span>}
                  </span>
                  <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ {hotel.rating || 'New'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{hotel.hotelName}</h2>
                  <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {hotel.district}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <svg className="w-5 h-5 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2C6.48 2 3.48 4.99 3.48 8.52c0 1.54.5 3.01 1.42 4.23L10 18.5l5.1-5.75c.92-1.22 1.42-2.69 1.42-4.23C16.52 4.99 13.52 2 10 2zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                  </svg>
                  <span>{hotel.location}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-bold text-amber-700">
                      ${hotel.price.toLocaleString()}
                      <span className="text-sm text-gray-500">/night</span>
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">👨👩👧</span>
                      <span>{hotel.capacity} Guests</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-sm rounded-full">
                      🛌 {hotel.roomType}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center"
                      >
                        {amenity === 'Wi-Fi' && '📶'}
                        {amenity === 'TV' && '📺'}
                        {amenity === 'Air Conditioning' && '❄️'}
                        {amenity === 'Mini Bar' && '🍸'}
                        {amenity === 'Swimming Pool' && '🏊'}
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        +{hotel.amenities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hotel_Section;