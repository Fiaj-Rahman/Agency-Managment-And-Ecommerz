
// src/components/HotelDetails.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaBed, FaUserAlt, FaCalendarAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalNights, setTotalNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetch(`https://varsity-project-server-site.vercel.app/hotel/${id}`)
      .then(res => res.json())
      .then(data => {
        setHotel(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch hotel:", err);
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

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    // Reset dates when modal is closed
    if (!isModalOpen) {
      setCheckInDate("");
      setCheckOutDate("");
      setTotalNights(0);
    }
  };

  const calculateNights = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const nightCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return nightCount > 0 ? nightCount : 0;
  };

  const handleDateChange = (type, value) => {
    if (type === 'checkIn') {
      setCheckInDate(value);
      if (checkOutDate) {
        const nights = calculateNights(value, checkOutDate);
        setTotalNights(nights);
        setTotalAmount(nights * hotel.price);
      }
    } else {
      setCheckOutDate(value);
      if (checkInDate) {
        const nights = calculateNights(checkInDate, value);
        setTotalNights(nights);
        setTotalAmount(nights * hotel.price);
      }
    }
  };

  const handleBookingSubmit = () => {
    if (totalNights <= 0) {
      alert("Please select valid check-in and check-out dates");
      return;
    }

    const bookingData = {
      hotelId: hotel._id,
      hotelName: hotel.hotelName,
      price: hotel.price,
      totalAmount: totalAmount,
      nights: totalNights,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      roomType: hotel.roomType,
      location: hotel.location,
      district: hotel.district,
    };

    console.log("Booking Submitted:", bookingData);

    fetch("https://varsity-project-server-site.vercel.app/hotel-bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
    .then((res) => res.json())
    .then((result) => {
      console.log("Payment redirect URL:", result.url);
      if (result.url) {
        window.location.replace(result.url);
      } else {
        console.error("Failed to retrieve the payment URL.");
        alert("Failed to initiate payment. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error submitting booking:", error);
      alert("An error occurred. Please try again.");
    });
  };

  if (loading) return <div className="text-center text-gray-500 py-10">Loading...</div>;
  if (!hotel) return <div className="text-center text-red-500 py-10">Hotel not found.</div>;

  return (
    <div className="py-16 px-6 sm:px-8 bg-gray-50">
      {/* ... (previous JSX remains the same until the modal) ... */}
      <div className="max-w-screen-xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Image Gallery */}
      <div className="space-y-4">
        <div className="relative h-96 w-full overflow-hidden rounded-xl bg-gray-100">
          <img
            src={hotel.images[0]}
            alt={hotel.hotelName}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 hover:opacity-90"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={hotel.images[i] || hotel.images[0]}
                alt={`${hotel.hotelName} view ${i}`}
                className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right: Info */}
      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{hotel.hotelName}</h1>
            {hotel.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Featured
              </span>
            )}
          </div>
          
          <div className="mt-3 flex items-center space-x-4">
            <div className="flex items-center">
              {renderStars(hotel.rating)}
              <span className="ml-2 text-sm text-gray-500">({hotel.reviews} reviews)</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              <span className="text-sm">{hotel.location}, {hotel.district}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 break-words leading-relaxed">
  <p>{hotel.description}</p>
</div>

        <div className="space-y-6">
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-gray-900">${hotel.price}</span>
                <span className="ml-2 text-gray-500">/ night</span>
                {hotel.originalPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">${hotel.originalPrice}</span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-700">
                  <FaBed className="mr-2 text-gray-400" />
                  <span>{hotel.roomType}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaUserAlt className="mr-2 text-gray-400" />
                  <span>{hotel.capacity} guests</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            {hotel.amenities?.slice(0, 5).map((amenity, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                {amenity}
              </span>
            ))}
          </div>

          <button
            onClick={handleModalToggle}
            className="w-full py-4 px-6 bg-gray-900 hover:bg-black text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <FaCalendarAlt />
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl w-full max-w-md border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Complete Your Booking</h2>
                <button 
                  onClick={handleModalToggle}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={hotel.images[0]} 
                      alt={hotel.hotelName}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{hotel.hotelName}</h3>
                    <p className="text-sm text-gray-500">{hotel.location}, {hotel.district}</p>
                    <div className="mt-1 flex items-center text-sm">
                      {renderStars(hotel.rating)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                      <input 
                        type="date" 
                        value={checkInDate}
                        onChange={(e) => handleDateChange('checkIn', e.target.value)}
                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                      <input 
                        type="date" 
                        value={checkOutDate}
                        onChange={(e) => handleDateChange('checkOut', e.target.value)}
                        min={checkInDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">${hotel.price} x {totalNights} nights</span>
                    <span className="font-medium">${hotel.price * totalNights}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-100">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">$15.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-100 font-bold text-lg">
                    <span>Total</span>
                    <span>${(hotel.price * totalNights) + 15}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={handleModalToggle}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;