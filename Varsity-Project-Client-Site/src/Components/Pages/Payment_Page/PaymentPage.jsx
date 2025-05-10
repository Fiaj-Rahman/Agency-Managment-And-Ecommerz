import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaLock, FaCreditCard, FaUser, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../Authentication/AuthProvider/AuthProvider";

const PaymentPage = () => {
    const { id } = useParams();
    const { state } = useLocation();
    
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);
    
    const [hotel, setHotel] = useState(state?.hotel || null);
    const [loading, setLoading] = useState(!state?.hotel);
    const [error, setError] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: user?.email || "",
        phone: "",
        address: "",
        amount: hotel?.price || 0,
        termsAgreed: false
    });
    
    const [errors, setErrors] = useState({});

    // Fetch hotel data if not passed via state
    useEffect(() => {
        if (!hotel) {
            const fetchHotel = async () => {
                try {
                    const response = await axios.get(`https://varsity-project-server-site.vercel.app/hotel/${id}`);
                    setHotel(response.data);
                    setFormData(prev => ({
                        ...prev,
                        amount: response.data.price,
                        email: user?.email || ""
                    }));
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchHotel();
        } else {
            setFormData(prev => ({
                ...prev,
                amount: hotel.price,
                email: user?.email || ""
            }));
        }
    }, [id, hotel, user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        
        if (!formData.termsAgreed) 
            newErrors.termsAgreed = "You must agree to the terms";
            
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            const paymentData = {
                hotelId: id,
                userEmail: formData.email,
                userName: formData.name,
                userPhone: formData.phone,
                userAddress: formData.address,
                amount: formData.amount
            };
            
            const response = await axios.post("https://varsity-project-server-site.vercel.app/hotel-payments", paymentData);
            
            // Redirect to SSLCommerz payment page
            window.location.href = response.data.url;
            
        } catch (err) {
            console.error("Payment failed:", err);
            setError("Payment failed. Please try again.");
        }
    };

    const formatCardNumber = (value) => {
        return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Payment Page</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Hotel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Hotel
                    </button>
                    <h1 className="ml-4 text-xl font-semibold text-gray-900">Complete Your Booking</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
                            
                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                {/* Personal Information */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <FaUser className="mr-2 text-blue-500" />
                                        Personal Information
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="John Doe"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>
                                        
                                        {/* Email (disabled) */}
                                        <div>
                                            <label className="block text-gray-700 mb-2">Email</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    disabled
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-900 cursor-not-allowed"
                                                />
                                                <MdEmail className="absolute right-3 top-3 text-gray-400" />
                                            </div>
                                        </div>
                                        
                                        {/* Phone */}
                                        <div>
                                            <label className="block text-gray-700 mb-2">Phone Number</label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="+8801XXXXXXXXX"
                                                />
                                                <FaPhone className="absolute right-3 top-3 text-gray-400" />
                                            </div>
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>
                                        
                                        {/* Address */}
                                        <div className="md:col-span-2">
                                            <label className="block text-gray-700 mb-2">Address</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="Your full address"
                                                />
                                                <FaMapMarkerAlt className="absolute right-3 top-3 text-gray-400" />
                                            </div>
                                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                        </div>
                                    </div>
                                </div>
                                
                                
                                {/* Terms and Conditions */}
                                <div className="mb-8">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="terms"
                                                name="termsAgreed"
                                                type="checkbox"
                                                checked={formData.termsAgreed}
                                                onChange={handleChange}
                                                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${errors.termsAgreed ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="terms" className="font-medium text-gray-700">
                                                I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a>
                                            </label>
                                            {errors.termsAgreed && <p className="text-red-500 text-sm mt-1">{errors.termsAgreed}</p>}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg font-medium"
                                >
                                    Confirm Payment
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                            </div>
                            
                            <div className="p-6">
                                {/* Hotel Info */}
                                {hotel && (
                                    <div className="flex mb-6">
                                        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                                            <img
                                                src={hotel.images[0]}
                                                alt={hotel.hotelName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-medium text-gray-900">{hotel.hotelName}</h4>
                                            <p className="text-sm text-gray-500">{hotel.roomType}</p>
                                            <p className="text-sm text-gray-500">{hotel.location}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Room Price</span>
                                        <span className="font-medium text-blue-600">${hotel?.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (10%)</span>
                                        <span className="font-medium text-blue-600">${(hotel?.price * 0.1).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-3">
                                        <span className="text-gray-800 font-semibold">Total</span>
                                        <span className="text-blue-600 font-bold">
                                            ${((hotel?.price || 0) * 1.1).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Cancellation Policy */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-blue-800 mb-2">Cancellation Policy</h4>
                                    <p className="text-xs text-blue-700">
                                        Free cancellation up to 24 hours before check-in. After that, 50% of the total amount will be charged.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;