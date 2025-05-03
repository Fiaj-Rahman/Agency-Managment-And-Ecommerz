import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact_Us = () => {
  const contactMethods = [
    {
      icon: <FaPhoneAlt className="text-3xl" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      subtitle: "Direct line to our support team",
      action: "Call Now",
      color: "from-blue-600 to-blue-800"
    },
    {
      icon: <FaEnvelope className="text-3xl" />,
      title: "Email",
      details: "hello@luxecompany.com",
      subtitle: "Typically respond within 2 hours",
      action: "Email Us",
      color: "from-purple-600 to-purple-800"
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl" />,
      title: "Headquarters",
      details: "450 Park Avenue\nNew York, NY 10022",
      subtitle: "By appointment only",
      action: "Get Directions",
      color: "from-amber-600 to-amber-800"
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Hours",
      details: "Monday - Friday\n9:00 AM - 6:00 PM EST",
      subtitle: "Closed weekends & holidays",
      action: "",
      color: "from-emerald-600 to-emerald-800"
    }
  ];

  const socialMedia = [
    { icon: <FaLinkedin className="text-xl" />, name: "LinkedIn" },
    { icon: <FaTwitter className="text-xl" />, name: "Twitter" },
    { icon: <FaInstagram className="text-xl" />, name: "Instagram" }
  ];

  return (
    <div className="relative bg-gray-50 overflow-hidden min-h-screen">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      </div>
      
      {/* Floating circles */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/3 -right-20 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-20"></div>

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
          >
            Connect With Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto opacity-80 font-light"
          >
            Experience our white-glove service through every point of contact
          </motion.p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="relative py-28 -mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${method.color} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-all duration-300`}></div>
                <div className="relative bg-white rounded-2xl p-8 h-full flex flex-col">
                  <div className={`bg-gradient-to-br ${method.color} text-white p-4 rounded-xl w-14 h-14 flex items-center justify-center mb-6`}>
                    {method.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-4 whitespace-pre-line">{method.details}</p>
                  <p className="text-sm text-gray-500 mb-6">{method.subtitle}</p>
                  {method.action && (
                    <div className="mt-auto">
                      <button className={`text-sm font-medium px-6 py-2 rounded-lg bg-gradient-to-br ${method.color} text-white hover:shadow-md transition-all`}>
                        {method.action}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Our Global Presence
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Strategically located to serve our international clientele
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-600 rounded-full mr-3"></span>
                New York
              </h3>
              <p className="text-gray-600 mb-2">450 Park Avenue</p>
              <p className="text-gray-600 mb-6">New York, NY 10022</p>
              <p className="text-sm text-gray-500">EST: 9AM - 6PM</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-purple-600 rounded-full mr-3"></span>
                London
              </h3>
              <p className="text-gray-600 mb-2">20 Berkeley Square</p>
              <p className="text-gray-600 mb-6">London W1J 6EQ</p>
              <p className="text-sm text-gray-500">GMT: 9AM - 6PM</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-amber-600 rounded-full mr-3"></span>
                Singapore
              </h3>
              <p className="text-gray-600 mb-2">10 Marina Boulevard</p>
              <p className="text-gray-600 mb-6">Singapore 018983</p>
              <p className="text-sm text-gray-500">SGT: 9AM - 6PM</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Stay Connected
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-12"
          >
            Follow us for the latest updates and insights
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center gap-6"
          >
            {socialMedia.map((social, index) => (
              <a 
                key={index} 
                href="#" 
                className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
              >
                {social.icon}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Start a Conversation?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl opacity-90 mb-8 max-w-2xl mx-auto"
          >
            Our team is standing by to discuss how we can help elevate your business.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="px-8 py-4 bg-white text-blue-800 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
              Schedule a Call
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-800 transition-colors">
              Email Our Team
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact_Us;