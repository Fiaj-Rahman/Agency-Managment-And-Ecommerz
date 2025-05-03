import React from "react";
import { FaHotel, FaCar, FaMapMarkedAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      icon: <FaHotel className="text-4xl" />,
      title: "Hotel Management",
      link: '/hotel-room',
      description: "Comprehensive solutions for luxury hotels and boutique resorts"
    },
    {
      icon: <FaCar className="text-4xl" />,
      title: "Vehicle Rental",
      link: '/vehicle',
      description: "Premium fleet with chauffeur services for elite transportation"
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl" />,
      title: "Tour Planning",
      link: '/tour-plan',
      description: "Bespoke itineraries crafted by travel connoisseurs"
    }
  ];

  const handleServiceClick = (path) => {
    navigate(path);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block mb-4 text-blue-600 font-medium tracking-wider uppercase">
            Our Services
          </span>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Premium Hospitality <br className="hidden md:block" /> Services
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed">
              Elevating travel experiences through meticulous service curation and exclusive partnerships with the finest providers worldwide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div 
              key={index}
              onClick={() => handleServiceClick(service.link)}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              
              {/* Icon container with gradient border */}
              <div className="relative mb-8 flex justify-center">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white p-5 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {service.icon}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="flex justify-center">
                <button 
                  className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out rounded-full group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceClick(service.link);
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-blue-500 to-purple-600 group-hover:translate-x-0 ease">
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" 
                      />
                    </svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">
                    Explore Service
                  </span>
                  <span className="relative invisible">Explore Service</span>
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