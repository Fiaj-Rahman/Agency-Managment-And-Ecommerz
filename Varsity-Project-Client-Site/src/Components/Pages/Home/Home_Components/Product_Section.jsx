import React, { useState, useEffect } from "react";

const Product_Section = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/product");
        const data = await response.json();
        const shuffledData = data.sort(() => Math.random() - 0.5);
        setProducts(shuffledData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return price.replace(/(৳)+/g, '৳').replace(/\s+/g, '');
  };

  return (
    <div className="bg-gray-100 min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Premium Collection
          </h1>
          <p className="text-gray-600 text-xl font-light">Experience Quality in Every Product</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <div className="h-60 relative">
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.productName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                  <span className="absolute top-4 right-4 bg-gray-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    🏷️ {product.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    {product.productName}
                  </h2>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    ⭐ 4.8
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-light">
                  {product.description}
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(product.defaultPrice)}
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
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

export default Product_Section;