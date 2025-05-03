import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaWifi, FaTv, FaConciergeBell, FaDumbbell, FaSnowflake, FaGlassWhiskey, FaStar, FaMapMarkerAlt, FaBed, FaUserAlt } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";

const View_Hotel = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await fetch(`https://varsity-project-server-site.vercel.app/hotel/${id}`);
                if (!response.ok) {
                    throw new Error('Hotel not found');
                }
                const data = await response.json();
                setHotel(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);

    const handleNextImage = () => {
        setCurrentImageIndex(prev => 
            prev === hotel.images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev => 
            prev === 0 ? hotel.images.length - 1 : prev - 1
        );
    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <FaStar 
                key={i} 
                className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} w-5 h-5`}
            />
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-red-100 p-6 rounded-lg max-w-md text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Hotel</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Hotels
                    </button>
                </div>
            </div>
        );
    }

    if (!hotel) {
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
                        Back to Hotels
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
                                    src={hotel.images[currentImageIndex]}
                                    alt={hotel.hotelName}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                    loading="lazy"
                                />
                            </div>
                            
                            {hotel.images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                                        aria-label="Previous image"
                                    >
                                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                                        aria-label="Next image"
                                    >
                                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                            
                            <div className="flex mt-4 space-x-2 px-4">
                                {hotel.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-16 h-16 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
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

                        {/* Hotel Details */}
                        <div className="p-8">
                            {/* Hotel Name and Rating */}
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-3xl font-bold text-gray-900">{hotel.hotelName}</h1>
                                <div className="flex items-center">
                                    {renderStars(hotel.rating || 0)}
                                    <span className="ml-2 text-gray-600">{hotel.rating || 'No ratings'}</span>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center text-gray-600 mb-6">
                                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                <span>{hotel.location}, {hotel.district}</span>
                            </div>

                            {/* Price and Room Type */}
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-2xl font-bold text-blue-600">
                                            ${hotel.price.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 ml-2">/ night</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FaBed className="text-gray-500" />
                                        <span className="font-medium">{hotel.roomType}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Hotel</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {hotel.description}
                                </p>
                            </div>

                            {/* Amenities */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {hotel.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center">
                                            {amenity === 'Wi-Fi' && <FaWifi className="text-blue-500 mr-2" />}
                                            {amenity === 'TV' && <FaTv className="text-blue-500 mr-2" />}
                                            {amenity === 'Room Service' && <FaConciergeBell className="text-blue-500 mr-2" />}
                                            {amenity === 'Gym' && <FaDumbbell className="text-blue-500 mr-2" />}
                                            {amenity === 'Air Conditioning' && <FaSnowflake className="text-blue-500 mr-2" />}
                                            {amenity === 'Mini Bar' && <FaGlassWhiskey className="text-blue-500 mr-2" />}
                                            <span className="text-gray-700">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Capacity */}
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="flex items-center">
                                    <FaUserAlt className="text-gray-500 mr-2" />
                                    <span className="text-gray-700">Capacity: {hotel.capacity} guests</span>
                                </div>
                                <div className="flex items-center">
                                    <MdDateRange className="text-gray-500 mr-2" />
                                    <span className="text-gray-700">Added: {hotel.createDate}</span>
                                </div>
                            </div>

                            {/* Booking Section */}
                            <div className="border-t pt-6">
                                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg">
                                    Book Now
                                </button>
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    Free cancellation up to 24 hours before check-in
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View_Hotel;