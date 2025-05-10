import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiStar, FiMapPin, FiUsers, FiGrid } from 'react-icons/fi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import Loader from '../components/Loader';
import Error from '../../ErrorPage/ErrorPage';
import { Link } from 'react-router-dom';

const Show_All_Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewImage, setViewImage] = useState(null);

  // ডিস্ট্রিক্ট এবং অ্যামেনিটির লিস্ট
  const districts = [
     "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogra", 
  "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chittagong", "Chuadanga", 
  "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni", 
  "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jessore", 
  "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", 
  "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", 
  "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", 
  "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", 
  "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", 
  "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", 
  "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", 
  "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
  ];

  const amenities = [
    'Wi-Fi', 'Air Conditioning', 'Swimming Pool',
    'Restaurant', 'Spa', 'Parking', 'Room Service'
  ];

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('https://varsity-project-server-site.vercel.app/hotel');
        setHotels(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load hotels');
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // সার্চ এবং ফিল্টার লজিক
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = selectedDistrict ? 
      hotel.district === selectedDistrict : true;
    
    const matchesAmenities = selectedAmenities.length > 0 ? 
      selectedAmenities.every(amenity => hotel.amenities.includes(amenity)) : true;

    return matchesSearch && matchesDistrict && matchesAmenities;
  });

  // ইমেজ স্লাইডার কন্ট্রোল
  const handleImageChange = (index, images, direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

//   if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* হেডার সেকশন */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Discover Luxury Stays
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience premium hospitality at Bangladesh's finest hotels and resorts
          </p>
        </div>

        {/* সার্চ এবং ফিল্টার সেকশন */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 mb-6">
            <FiSearch className="text-gray-500 mr-3" size={20} />
            <input
              type="text"
              placeholder="Search hotels or locations..."
              className="w-full bg-transparent focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-gray-700">
                <FiMapPin className="mr-2" />
                Select District:
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-gray-700">
                <FiGrid className="mr-2" />
                Amenities:
              </label>
              <div className="grid grid-cols-2 gap-2 text-gray-700">
                {amenities.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAmenities([...selectedAmenities, amenity]);
                        } else {
                          setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                        }
                      }}
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* হোটেল গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700">
          {filteredHotels.map(hotel => (
            <div key={hotel._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
              {/* ইমেজ স্লাইডার */}
              <div className="relative h-64">
                {hotel.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={hotel.hotelName}
                    className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {hotel.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-gray-300'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                  onClick={() => handleImageChange(currentImageIndex, hotel.images, 'prev')}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                  onClick={() => handleImageChange(currentImageIndex, hotel.images, 'next')}
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* হোটেল ডিটেইলস */}
              <div className="p-6 bg-gradient-to-br from-white to-gray-50">
  {/* Header Section */}
  <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-200">
    <h3 className="text-2xl font-bold text-gray-900 font-serif tracking-tight">
      {hotel.hotelName}
    </h3>
    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
      {hotel.roomType}
    </span>
  </div>

  {/* Location & Capacity */}
  <div className="mb-5 space-y-3">
    <div className="flex items-center text-gray-600">
      <FiMapPin className="mr-2 text-blue-600 w-5 h-5" />
      <p className="truncate font-medium">{hotel.location}</p>
    </div>
    <div className="flex items-center text-gray-600">
      <FiUsers className="mr-2 text-blue-600 w-5 h-5" />
      <span className="font-medium">Up to {hotel.capacity} guests</span>
    </div>
  </div>

  {/* Amenities */}
  <div className="mb-6">
    <div className="flex flex-wrap gap-2">
      {hotel.amenities.map((amenity, index) => (
        <span 
          key={index}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm flex items-center"
        >
          <FiStar className="mr-1.5 text-blue-500 w-4 h-4" />
          {amenity}
        </span>
      ))}
    </div>
  </div>

  {/* Price & CTA */}
  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
    <div>
      <span className="text-3xl font-bold text-gray-900 tracking-tight">
        ৳{hotel.price}
      </span>
      <span className="text-gray-500 font-medium ml-1">/night</span>
    </div>
   <Link to={`/hotel-room/${hotel._id}`}>
   <button 
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"

    >
      Book Now
    </button>
   </Link>
  </div>
</div>
            </div>
          ))}
        </div>

        {/* ইমেজ ভিউয়ার মোডাল */}
        {viewImage && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="max-w-4xl w-full p-4">
              <img 
                src={viewImage} 
                alt="Full view" 
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                className="absolute top-8 right-8 text-white text-4xl"
                onClick={() => setViewImage(null)}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Show_All_Hotels;