import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const View_Tour_Plan = () => {
    const { id } = useParams();
    const [tour, setTour] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/tour/${id}`)
            .then((response) => response.json())
            .then((data) => setTour(data))
            .catch((error) => console.error("Error:", error));
    }, [id]);

    if (!tour) {
        return <div className="text-center py-20">Loading tour details...</div>;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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
                    Back to Tours
                </button>

                {/* Tour Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-xl overflow-hidden border">
                                <img
                                    src={tour.images[0]}
                                    alt={tour.touristSpotName}
                                    className="w-full h-full object-cover p-4 transform hover:scale-105 transition-transform"
                                />
                            </div>
                            {tour.images.length > 1 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {tour.images.slice(1).map((img, index) => (
                                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                            <img
                                                src={img}
                                                alt={`${tour.touristSpotName} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tour Details */}
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold text-gray-900">{tour.touristSpotName}</h1>

                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-semibold text-blue-600">
                                    {tour.price}
                                </span>
                                {tour.totalTourPrice && (
                                    <span className="text-xl text-gray-400 line-through">
                                        {tour.totalTourPrice}
                                    </span>
                                )}
                            </div>

                            {/* Tour Description */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tour Details</h3>
                                <div className="text-gray-600 whitespace-pre-line break-words text-justify leading-relaxed">
                                    {tour.touristSpotDetails}
                                </div>
                            </div>

                            {/* Tour Specifications */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">Start Date:</span> {formatDate(tour.startDate)}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">End Date:</span> {formatDate(tour.endDate)}
                                </div>
                            </div>

                            {/* Book Now Section */}
                            <div className="border-t pt-6">
                                <div className="flex items-center space-x-4">
                                    <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                        Book Now
                                    </button>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Free cancellation up to 24 hours before tour start
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

export default View_Tour_Plan;