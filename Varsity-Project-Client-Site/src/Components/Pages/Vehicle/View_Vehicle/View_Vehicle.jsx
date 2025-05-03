import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCar, FaGasPump, FaCogs, FaUsers, FaMapMarkerAlt, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { GiCarSeat, GiGearStickPattern } from "react-icons/gi";
import { MdAir, MdUsb } from "react-icons/md";
import { BsSpeedometer2 } from "react-icons/bs";

const View_Vehicle = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('details');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await fetch(`https://varsity-project-server-site.vercel.app/vehicle/${id}`);
                if (!response.ok) {
                    throw new Error('Vehicle not found');
                }
                const data = await response.json();
                setVehicle(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const handleNextImage = () => {
        setCurrentImageIndex(prev => 
            prev === vehicle.images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev => 
            prev === 0 ? vehicle.images.length - 1 : prev - 1
        );
    };

    const renderFeatureIcon = (feature) => {
        switch(feature) {
            case 'USB Port': return <MdUsb className="text-blue-500 mr-2" />;
            case 'AC': return <MdAir className="text-blue-500 mr-2" />;
            case 'GPS Navigation': return <BsSpeedometer2 className="text-blue-500 mr-2" />;
            case 'Child Seat': return <GiCarSeat className="text-blue-500 mr-2" />;
            default: return <FaStar className="text-blue-500 mr-2" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Vehicle</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Vehicles
                    </button>
                </div>
            </div>
        );
    }

    if (!vehicle) {
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
                        Back to Vehicles
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
                                    src={vehicle.images[currentImageIndex]}
                                    alt={vehicle.vehicleName}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                    loading="lazy"
                                />
                            </div>
                            
                            {vehicle.images.length > 1 && (
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
                                {vehicle.images.map((img, index) => (
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

                        {/* Vehicle Details */}
                        <div className="p-8">
                            {/* Name and Rating */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">{vehicle.vehicleName}</h1>
                                <div className="flex items-center text-gray-600 mb-3">
                                    <span className="font-medium">{vehicle.brand}</span>
                                    <span className="mx-2">•</span>
                                    <span>{vehicle.model}</span>
                                </div>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar 
                                            key={i} 
                                            className={`${i < (vehicle.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} w-5 h-5`}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-600">{vehicle.rating || 'No ratings yet'}</span>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Price per hour</div>
                                    <div className="text-xl font-bold text-blue-600">
                                        {vehicle.pricePerHour.toLocaleString()}৳
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Price per day</div>
                                    <div className="text-xl font-bold text-blue-600">
                                        {vehicle.pricePerDay.toLocaleString()}৳
                                    </div>
                                </div>
                            </div>

                            {/* Quick Specs */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                                    <FaCar className="text-blue-500 mr-2" />
                                    <span>{vehicle.vehicleType}</span>
                                </div>
                                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                                    <GiGearStickPattern className="text-blue-500 mr-2" />
                                    <span>{vehicle.transmission}</span>
                                </div>
                                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                                    <FaGasPump className="text-blue-500 mr-2" />
                                    <span>{vehicle.fuelType}</span>
                                </div>
                                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                                    <FaUsers className="text-blue-500 mr-2" />
                                    <span>{vehicle.seats} Seats</span>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center bg-gray-50 p-3 rounded-lg mb-6">
                                <FaMapMarkerAlt className="text-blue-500 mr-2" />
                                <span>{vehicle.location}, {vehicle.district}</span>
                            </div>

                            {/* Features */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {vehicle.features.map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            {renderFeatureIcon(feature)}
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Booking Section */}
                            <div className="border-t pt-6">
                                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg">
                                    Rent This Vehicle
                                </button>
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    Free cancellation up to 24 hours before pickup
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="border-t">
                        <div className="flex border-b">
                            <button
                                className={`px-6 py-4 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Vehicle Details
                            </button>
                            <button
                                className={`px-6 py-4 font-medium ${activeTab === 'specs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('specs')}
                            >
                                Specifications
                            </button>
                            <button
                                className={`px-6 py-4 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Reviews
                            </button>
                        </div>

                        <div className="p-8">
                            {activeTab === 'details' && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Vehicle</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {vehicle.description || 'No detailed description available.'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'specs' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">General</h4>
                                        <ul className="space-y-3">
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Brand</span>
                                                <span className="font-medium">{vehicle.brand}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Model</span>
                                                <span className="font-medium">{vehicle.model}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Type</span>
                                                <span className="font-medium">{vehicle.vehicleType}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Status</span>
                                                <span className="font-medium capitalize">{vehicle.status}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Technical</h4>
                                        <ul className="space-y-3">
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Transmission</span>
                                                <span className="font-medium">{vehicle.transmission}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Fuel Type</span>
                                                <span className="font-medium">{vehicle.fuelType}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Seating Capacity</span>
                                                <span className="font-medium">{vehicle.seats}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Added On</span>
                                                <span className="font-medium">
                                                    {new Date(vehicle.createdAt).toLocaleDateString()}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-4">No reviews yet</div>
                                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                        Be the first to review
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View_Vehicle;