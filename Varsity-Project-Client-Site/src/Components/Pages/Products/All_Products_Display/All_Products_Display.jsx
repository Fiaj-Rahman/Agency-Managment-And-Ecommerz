import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Authentication/AuthProvider/AuthProvider";
import { Spinner } from "@material-tailwind/react";

const All_Products_Display = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data and user data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data and user data if user email is available
        const [productsResponse, userResponse] = await Promise.all([
          fetch("http://localhost:5000/product"),
          user?.email ? fetch(`http://localhost:5000/signup?email=${user.email}`) : null,
        ]);

        // Check if productsResponse is OK
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setCategories(["All", ...new Set(productsData.map(p => p.category))]);

        // If user email is available, fetch user data
        if (user?.email && userResponse) {
          const userData = await userResponse.json();
          setUserData(userData[0]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  // Truncate product description if too long
  const truncateDescription = (text, limit = 80) => {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  // Filter products based on search query and selected category
  const filteredProducts = products
    .filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(product =>
      selectedCategory === "All" || product.category === selectedCategory
    );

  // Loading spinner display while data is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  // Display error if any
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="mt-16 flex flex-col items-center gap-12 text-gray-900 p-6 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Enhanced Header Section */}
      <div className="text-center space-y-6 max-w-5xl relative">
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full" />
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-[Inter] tracking-tighter">
          Curated Luxury Collection
        </h1>
        <p className="text-slate-300 text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Experience unparalleled elegance with our meticulously selected premium items, crafted for the discerning few
        </p>
      </div>

      {/* Premium Filter Section */}
      <div className="w-full max-w-7xl space-y-6 md:space-y-0 md:flex md:gap-8 md:items-center relative z-10">
        <div className="flex-1 relative group bg-blue-900 rounded-xl text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-cyan-500/30 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="relative flex items-center bg-slate-700/30 backdrop-blur-lg rounded-xl border border-slate-600/50 hover:border-indigo-500/50 transition-all duration-300">
            <div className="pl-6 pr-3 py-5 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search exclusive items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-5 bg-blue-900 border-none border-gray-700  focus:ring-0 placeholder-slate-400 text-slate-200 text-lg font-light"
            />
          </div>
        </div>

        <div className="flex-1 relative group bg-blue-900 rounded-xl text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-cyan-500/30 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="relative flex items-center bg-slate-700/30 backdrop-blur-lg rounded-xl border border-slate-600/50 hover:border-indigo-500/50 transition-all duration-300">
            <div className="pl-6 pr-3 py-5 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-5 bg-gray-200 border-none text-black  focus:ring-0 text-slate-200 text-lg font-light appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">{category}</option>
              ))}
            </select>
            <div className="pr-6 pl-3 py-5 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-slate-400">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full" />
            <svg className="w-32 h-32 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-xl font-light text-slate-400">No items match your refined criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 w-full max-w-7xl">
          {filteredProducts.map(product => {
            // Get the product price (if available)
            const displayPrice = product.discountedPrice || product.price;

            return (
              <div
                key={product._id}
                className="group relative bg-blue-900 text-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02]"
              >
                {/* Hover-activated Border Glow */}
                <div className="absolute inset-0 rounded-3xl border-2 border-slate-700/50 group-hover:border-cyan-500/30 transition-colors duration-500 z-0" />

                {/* Product Image Section */}
                <div className="relative h-96 w-full overflow-hidden">
                  <div className="relative h-full w-full group-hover:scale-105 transition-transform duration-700 ease-out">
                    <img
                      src={product.image}
                      alt={product.productName}
                      loading="lazy"
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Premium Category Badge */}
                  <div className="absolute top-5 right-5 z-20">
                    <div className="flex items-center space-x-2 bg-gradient-to-br from-cyan-600 to-indigo-700 px-4 py-2 rounded-full backdrop-blur-sm shadow-xl">
                      <span className="text-sm font-semibold text-cyan-100 tracking-wide uppercase">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Hover-overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Product Info Section */}
                <div className="p-7 flex flex-col justify-between flex-1 space-y-6">
                  <div>
                    {/* Product Title */}
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-3 tracking-tight">
                      {product.productName}
                    </h3>

                    {/* Description */}
                    <div className="relative">
                      <p className="text-slate-400 text-sm font-light leading-relaxed tracking-wide max-h-24 overflow-hidden transition-all duration-500 group-hover:max-h-48">
                        {truncateDescription(product.description)}
                      </p>
                    </div>
                  </div>

                  {/* Price & CTA Section */}
                  <div className="flex items-center justify-between border-t border-slate-700/50 pt-6">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-slate-400 tracking-wider">EXCLUSIVE PRICE</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                          {displayPrice}
                        </span>
                        <span className="text-sm line-through text-slate-500">{product.defaultPrice}</span>
                      </div>
                    </div>
                    <Link
                      to={`/product/${product._id}`}
                      className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-cyan-600/90 to-indigo-600/90 hover:from-cyan-500/90 hover:to-indigo-500/90 text-slate-100 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-[1.05]"
                    >
                      <span className="tracking-wide">Discover</span>
                      <svg
                        className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default All_Products_Display;
