import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

const View_Tourist = () => {
    const { id } = useParams();
    const [touristSpot, setTouristSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTouristSpot = async () => {
            try {
                const response = await fetch(`https://varsity-project-server-site.vercel.app/tour/${id}`);
                if (!response.ok) {
                    throw new Error('Tourist spot not found');
                }
                const data = await response.json();
                setTouristSpot(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTouristSpot();
    }, [id]);

    const handleNextImage = () => {
        setCurrentImageIndex(prev => 
            prev === touristSpot.images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev => 
            prev === 0 ? touristSpot.images.length - 1 : prev - 1
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tourist spot details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Tourist Spot</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Tourist Spots
                    </button>
                </div>
            </div>
        );
    }

    if (!touristSpot) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Back Button */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <IoIosArrowBack className="mr-2" />
                        Back to Tourist Spots
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Gallery */}
                        <div className="relative">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-l-xl overflow-hidden">
                                <img
                                    src={touristSpot.images[currentImageIndex]}
                                    alt={touristSpot.touristSpotName}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                    loading="lazy"
                                />
                            </div>
                            
                            {touristSpot.images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:bg-opacity-100 transition-all"
                                        aria-label="Previous image"
                                    >
                                        <FaChevronLeft className="w-5 h-5 text-gray-800" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:bg-opacity-100 transition-all"
                                        aria-label="Next image"
                                    >
                                        <FaChevronRight className="w-5 h-5 text-gray-800" />
                                    </button>
                                </>
                            )}
                            
                            <div className="flex mt-4 space-x-2 px-4">
                                {touristSpot.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-16 h-16 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'} transition-all`}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`Thumbnail ${index + 1}`} 
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tourist Spot Details */}
                        <div className="p-8">
                            {/* Name and Rating */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{touristSpot.touristSpotName}</h1>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar 
                                            key={i} 
                                            className={`${i < 4 ? 'text-yellow-400' : 'text-gray-300'} w-5 h-5`}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-600">4.8 (124 reviews)</span>
                                </div>
                            </div>

                            {/* Price Information */}
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Starting from</div>
                                        <div className="flex items-end">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {touristSpot.price}
                                            </span>
                                            <span className="text-lg text-gray-500 ml-2 line-through">
                                                {touristSpot.totalTourPrice}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Save {Math.round((parseInt(touristSpot.totalTourPrice) - parseInt(touristSpot.price)) / parseInt(touristSpot.totalTourPrice) * 100)}%
                                    </div>
                                </div>
                            </div>

                            {/* Date Information */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center text-gray-600 mb-1">
                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                        <span className="text-sm">Start Date</span>
                                    </div>
                                    <div className="font-medium">{formatDate(touristSpot.startDate)}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center text-gray-600 mb-1">
                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                        <span className="text-sm">End Date</span>
                                    </div>
                                    <div className="font-medium">{formatDate(touristSpot.endDate)}</div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Destination</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {touristSpot.touristSpotDetails}
                                </p>
                            </div>

                            {/* Highlights */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tour Highlights</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        <span className="text-gray-700">Guided tours</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        <span className="text-gray-700">Local cuisine tasting</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        <span className="text-gray-700">Photo opportunities</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        <span className="text-gray-700">Cultural experiences</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Booking Section */}
                            <div className="border-t pt-6">
                                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg flex items-center justify-center">
                                    <FaMoneyBillWave className="mr-2" />
                                    Book This Tour
                                </button>
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    Free cancellation up to 7 days before tour date
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-5 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <FaMapMarkerAlt className="text-blue-500 mr-2" />
                                    Location Details
                                </h3>
                                <p className="text-gray-600">This tourist spot is located in a prime area with easy access to transportation and nearby attractions.</p>
                            </div>
                            
                            <div className="bg-gray-50 p-5 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <FaCalendarAlt className="text-blue-500 mr-2" />
                                    Best Time to Visit
                                </h3>
                                <p className="text-gray-600">The ideal time to visit is during the spring and autumn months for pleasant weather conditions.</p>
                            </div>
                            
                            <div className="bg-gray-50 p-5 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <FaStar className="text-blue-500 mr-2" />
                                    Traveler Tips
                                </h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>• Wear comfortable walking shoes</li>
                                    <li>• Bring a camera for amazing photos</li>
                                    <li>• Carry local currency for small purchases</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View_Tourist;