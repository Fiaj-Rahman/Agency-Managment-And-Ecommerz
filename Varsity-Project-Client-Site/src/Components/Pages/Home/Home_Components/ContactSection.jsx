// ContactSection.jsx
import React from "react";

const ContactSection = () => {
  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
        <p className="text-xl mb-8">Contact us for premium hospitality solutions</p>
        <button className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
          Contact Us Now
        </button>
      </div>
    </section>
  );
};

export default ContactSection;