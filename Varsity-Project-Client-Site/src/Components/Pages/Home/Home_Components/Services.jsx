// Services.jsx
import React from "react";
import { FaHotel, FaCar, FaMapMarkedAlt } from "react-icons/fa";

const Services = () => {
  const services = [
    {
      icon: <FaHotel className="text-4xl text-white" />,
      title: "Hotel Management",
      description: "Comprehensive solutions for luxury hotels and boutique resorts"
    },
    {
      icon: <FaCar className="text-4xl text-white" />,
      title: "Vehicle Rental",
      description: "Premium fleet with chauffeur services for elite transportation"
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl text-white" />,
      title: "Tour Planning",
      description: "Bespoke itineraries crafted by travel connoisseurs"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-blue-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Hospitality Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elevating travel experiences through meticulous service curation and exclusive partnerships
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
              
              <div className="mb-6 flex justify-center">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-5 rounded-2xl shadow-lg">
                  {service.icon}
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6 flex justify-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors">
                  Explore Service
                  <svg 
                    className="w-4 h-4 mt-px"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;