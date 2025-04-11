// WhyChooseUs.jsx
import React from "react";
import { FaHeadset, FaHandshake, FaUserTie, FaShieldAlt, FaCoins, FaRocket } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaHeadset className="text-4xl text-white" />,
      title: "24/7 Priority Support",
      description: "Instant access to our expert concierge team via multiple channels",
      bg: "from-blue-500 to-purple-500"
    },
    {
      icon: <FaHandshake className="text-4xl text-white" />,
      title: "Best Price Guarantee",
      description: "Found cheaper? We'll match it plus 10% credit",
      bg: "from-green-500 to-blue-500"
    },
    {
      icon: <FaUserTie className="text-4xl text-white" />,
      title: "VIP Treatment",
      description: "Exclusive upgrades & personalized services",
      bg: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-white" />,
      title: "Secure Transactions",
      description: "256-bit SSL encrypted payments",
      bg: "from-yellow-500 to-orange-500"
    },
    {
      icon: <FaCoins className="text-4xl text-white" />,
      title: "Flexible Payments",
      description: "Multiple payment options & installment plans",
      bg: "from-pink-500 to-red-500"
    },
    {
      icon: <FaRocket className="text-4xl text-white" />,
      title: "Instant Confirmation",
      description: "Real-time booking verification",
      bg: "from-blue-600 to-cyan-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Clients Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premium experiences powered by cutting-edge technology and human-centric service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Icon Container */}
              <div className="mb-6 flex justify-center">
                <div className={`bg-gradient-to-br ${feature.bg} p-5 rounded-2xl shadow-lg`}>
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Progress Bar */}
              <div className="h-1 bg-gray-200 rounded-full mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 delay-300"
                  style={{ width: '97%' }}
                ></div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Client Satisfaction</span>
                <span>97%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 opacity-90">
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-gray-600">Successful Bookings</div>
          </div>
          
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-purple-600 mb-2">10+</div>
            <div className="text-gray-600">Premium Partners</div>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;