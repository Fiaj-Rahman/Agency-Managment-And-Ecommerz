import React from "react";
import { FaLightbulb, FaUsers, FaChartLine, FaShieldAlt, FaMedal, FaHandshake } from "react-icons/fa";
import { motion } from "framer-motion";

const About_Us = () => {
  const stats = [
    { value: "10+", label: "Years Experience", icon: <FaChartLine className="text-2xl" /> },
    { value: "50+", label: "Team Members", icon: <FaUsers className="text-2xl" /> },
    { value: "1000+", label: "Satisfied Clients", icon: <FaLightbulb className="text-2xl" /> }
  ];

  const values = [
    { 
      title: "Innovation", 
      description: "We challenge conventions and pioneer new approaches to solve complex problems in elegant ways.",
      icon: <FaLightbulb className="text-blue-500" />
    },
    { 
      title: "Excellence", 
      description: "We pursue mastery in our craft, delivering work that exceeds expectations and stands the test of time.",
      icon: <FaMedal className="text-blue-500" />
    },
    { 
      title: "Integrity", 
      description: "We build trust through transparency, honesty, and accountability in all our relationships.",
      icon: <FaHandshake className="text-blue-500" />
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gray-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Redefining Excellence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90"
          >
            Where visionary thinking meets unparalleled execution to create transformative digital experiences.
          </motion.p>
        </div>
        
        {/* Animated decorative elements */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute -bottom-20 -right-20 w-64 h-64 bg-white rounded-full filter blur-xl"
        ></motion.div>
      </section>

      {/* About Content */}
      <section className="relative py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative">
                {/* Abstract shape placeholder */}
                <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-5xl text-blue-500 mb-4">✧</div>
                    <h3 className="text-xl font-medium text-gray-700">Our Vision</h3>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -z-10 -top-6 -left-6 w-full h-full border-2 border-blue-200 rounded-3xl"></div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Philosophy
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that exceptional digital experiences are born at the intersection of cutting-edge technology and human-centered design. Our approach combines technical excellence with deep empathy to create solutions that resonate.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Every project begins with listening—understanding not just what our clients need today, but what will propel them forward tomorrow. We're not just service providers; we're strategic partners in your digital transformation.
              </p>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="text-blue-800 font-medium italic">
                  "Quality is never an accident; it is always the result of intelligent effort."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Our Core Principles
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              The foundation of everything we do
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 bg-gradient-to-br from-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full filter blur-2xl opacity-10"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-400 rounded-full filter blur-2xl opacity-10"></div>
        
        <div className="container mx-auto px-6 text-center relative">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Elevate Your Digital Presence?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl opacity-90 mb-8 max-w-2xl mx-auto"
          >
            Let's collaborate to create something extraordinary together.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <button className="px-8 py-4 bg-white text-blue-800 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
              Start Your Journey
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About_Us;