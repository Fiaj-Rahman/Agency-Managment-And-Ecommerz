import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const View_Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://varsity-project-server-site.vercel.app/product/${id}`)
            .then((response) => response.json())
            .then((data) => setProduct(data))
            .catch((error) => console.error("Error:", error));
    }, [id]);

    if (!product) {
        return <div className="text-center py-20">Loading product details...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Products
                </button>

                {/* Product Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-xl overflow-hidden border">
                                <img
                                    src={product.image}
                                    alt={product.productName}
                                    className="w-full h-full object-contain p-8 transform hover:scale-105 transition-transform"
                                />
                            </div>

                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold text-gray-900">{product.productName}</h1>

                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-semibold text-blue-600">
                                    ${parseFloat(product.price).toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xl text-gray-400 line-through">
                                        ${parseFloat(product.originalPrice).toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Product Description */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h3>
                                <div className="text-gray-600 whitespace-pre-line break-words text-justify leading-relaxed">
                                    {product.description}
                                </div>
                            </div>

                            {/* Product Specifications */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">SKU:</span> {product.sku || 'N/A'}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span className="font-medium">Category:</span> {product.category || 'N/A'}
                                </div>
                            </div>

                            {/* Add to Cart Section */}
                            <div className="border-t pt-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border rounded-lg">
                                        <button className="px-4 py-2 text-gray-600 hover:bg-gray-50">-</button>
                                        <input type="number" className="w-16 text-center border-0" value="1" />
                                        <button className="px-4 py-2 text-gray-600 hover:bg-gray-50">+</button>
                                    </div>
                                    <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Free shipping on orders over $100
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View_Product;