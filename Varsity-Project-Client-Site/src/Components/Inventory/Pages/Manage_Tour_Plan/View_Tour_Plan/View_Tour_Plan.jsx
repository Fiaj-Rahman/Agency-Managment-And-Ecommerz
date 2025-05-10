import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

const View_Tour_Plan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch(`https://varsity-project-server-site.vercel.app/tour/${id}`)
      .then(res => res.json())
      .then(data => {
        setTour(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tour:", err);
        setLoading(false);
      });
  }, [id]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === tour.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? tour.images.length - 1 : prev - 1
    );
  };

  const handleBookingSubmit = () => {
    const bookingData = {
      tourId: tour._id,
      tourName: tour.touristSpotName,
      price: tour.price,
      startDate: tour.startDate,
      endDate: tour.endDate,
    };
  
    fetch("https://varsity-project-server-site.vercel.app/travel-bookings", {  // ✅ Changed to correct endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.url) {
          window.location.href = result.url; // Redirect to payment
        } else {
          alert("Payment URL not received. Try again.");
          console.error("No URL in response:", result);
        }
      })
      .catch((error) => {
        alert("Payment failed. Check console for details.");
        console.error("Payment error:", error);
      });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center text-gray-500 py-10">Loading...</div>;
  if (!tour) return <div className="text-center text-red-500 py-10">Tour not found.</div>;

  return (
    <div className="py-12 text-black px-6 sm:px-8 bg-gradient-to-r from-indigo-50 to-blue-100">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <IoIosArrowBack className="mr-2" />
        Back to Tours
      </button>

      <div className="max-w-screen-xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Image Gallery */}
          <div className="relative">
            <img
              src={tour.images[currentImageIndex]}
              alt={tour.touristSpotName}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
            
            {tour.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                >
                  <FaChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                >
                  <FaChevronRight className="w-5 h-5 text-gray-800" />
                </button>
              </>
            )}
            
            <div className="flex mt-4 space-x-2">
              {tour.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
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

          {/* Right: Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-blue-800">{tour.touristSpotName}</h1>
            <div className="flex items-center">
              {renderStars(4)}
              <span className="ml-2 text-gray-600">4.8 (124 reviews)</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2" />
              {tour.location}, {tour.district}
            </div>

            <p className="text-gray-700 whitespace-pre-line">{tour.touristSpotDetails}</p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-blue-600">${tour.price}</span>
                  {tour.totalTourPrice && (
                    <>
                      <span className="ml-2 text-gray-500 line-through">${tour.totalTourPrice}</span>
                      <span className="ml-2 text-green-600 font-medium">
                        Save {Math.round((parseInt(tour.totalTourPrice) - parseInt(tour.price)) / parseInt(tour.totalTourPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <span>Start Date</span>
                </div>
                <div className="font-medium">{formatDate(tour.startDate)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <span>End Date</span>
                </div>
                <div className="font-medium">{formatDate(tour.endDate)}</div>
              </div>
            </div>

            <button
              onClick={handleModalToggle}
              className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Book This Tour
            </button>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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

      {/* Additional Information Section */}
      <div className="max-w-screen-xl mx-auto mt-8 bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Itinerary</h2>
        
        <div className="space-y-6">
          {tour.itinerary && tour.itinerary.length > 0 ? (
            tour.itinerary.map((day, index) => (
              <div key={index} className="bg-gray-50 p-5 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Day {index + 1}</h3>
                <p className="text-gray-600 whitespace-pre-line">{day}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No itinerary details available.</p>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 text-gray-900 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-700">Confirm Tour Booking</h2>
              <button onClick={handleModalToggle} className="text-gray-500 hover:text-gray-700">X</button>
            </div>

            <div className="space-y-2">
              <p><strong>Tour:</strong> {tour.touristSpotName}</p>
              <p><strong>Price:</strong> ${tour.price}</p>
              {tour.totalTourPrice && (
                <p><strong>Original Price:</strong> ${tour.totalTourPrice}</p>
              )}
              <p><strong>Location:</strong> {tour.location}, {tour.district}</p>
              <p><strong>Dates:</strong> {formatDate(tour.startDate)} - {formatDate(tour.endDate)}</p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleBookingSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={handleModalToggle}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View_Tour_Plan;