import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Travel_Package_Section = () => {
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("https://varsity-project-server-site.vercel.app/tour");
                const data = await response.json();
                const shuffledData = data.sort(() => Math.random() - 0.5);
                setPackages(shuffledData);
            } catch (error) {
                console.error("Error fetching packages:", error);
            }
        };

        fetchPackages();
    }, []);

    const formatPrice = (price) => {
        const cleanedPrice = price.replace(/(৳)+/g, '৳').replace(/\s+/g, '');
        return cleanedPrice.split('৳')[0] + '৳';
    };

    return (
        <div className="bg-gray-100 min-h-screen py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Curated Travel Experiences
                    </h1>
                    <p className="text-gray-600 text-xl font-light">Discover Luxury in Every Journey</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {packages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
                        >
                            <Link to={`/tour-plan/${pkg._id}`}>
                            <div className="relative overflow-hidden">
                                <div className="h-60 relative">
                                    <img
                                        src={pkg.images[0] || "https://via.placeholder.com/300"}
                                        alt={pkg.touristSpotName}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                                    <span className="absolute top-4 right-4 bg-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                        ✨ Featured
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <h2 className="text-xl font-bold text-gray-900 truncate">
                                        {pkg.touristSpotName}
                                    </h2>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-light">
                                    {pkg.touristSpotDetails}
                                </p>

                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm">
                                                {new Date(pkg.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                                                {new Date(pkg.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <span className="text-sm bg-gray-800 px-2 py-1 rounded-full">
                                            {Math.ceil((new Date(pkg.endDate) - new Date(pkg.startDate)) / (1000 * 3600 * 24))} Days
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {formatPrice(pkg.totalTourPrice)}
                                            </div>
                                            <div className="text-sm text-gray-500 line-through">
                                                {formatPrice(pkg.price)}
                                            </div>
                                        </div>
                                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Travel_Package_Section;