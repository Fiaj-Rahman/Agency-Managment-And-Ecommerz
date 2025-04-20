import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Manage_Hotel = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/hotel");
      setHotels(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load hotels");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await axios.delete(`http://localhost:5000/hotel/${id}`);
        toast.success("Hotel deleted successfully");
        fetchHotels();
      } catch (error) {
        toast.error("Failed to delete hotel");
      }
    }
  };

  const handleView = (hotel) => {
    setSelectedHotel(hotel);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Manage Hotels</h1>
        
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
             <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">SL.</th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Hotel Name</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Capacity</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel, index) => (
                  <tr key={hotel._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="w-20 h-20 overflow-hidden rounded-lg">
                        <img 
                          src={hotel.images?.[0] || '/placeholder-hotel.jpg'} 
                          alt={hotel.hotelName}
                          className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                          onClick={() => handleView(hotel)}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">{hotel.hotelName}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-[200px] truncate" title={hotel.location}>
                        {hotel.location}
                      </div>
                    </td>
                    <td className="py-3 px-4">৳{hotel.price}</td>
                    <td className="py-3 px-4">{hotel.capacity}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded ${hotel.status === 'available' ? 
                        'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {hotel.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex space-x-3">
                      <button 
                        onClick={() => handleView(hotel)}
                        className="text-blue-600 hover:text-blue-800 tooltip"
                        data-tip="View Details"
                      >
                        <FaEye size={20} />
                      </button>
                      <Link 
                        to={`/dashboard/update-hotel/${hotel._id}`}
                        className="text-green-600 hover:text-green-800 tooltip"
                        data-tip="Edit"
                      >
                        <FaEdit size={20} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(hotel._id)}
                        className="text-red-600 hover:text-red-800 tooltip"
                        data-tip="Delete"
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Modal */}
        {selectedHotel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">{selectedHotel.hotelName}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Location:</p>
                  <p>{selectedHotel.location}</p>
                </div>
                <div>
                  <p className="font-semibold">District:</p>
                  <p>{selectedHotel.district}</p>
                </div>
                <div>
                  <p className="font-semibold">Price:</p>
                  <p>৳{selectedHotel.price}/night</p>
                </div>
                <div>
                  <p className="font-semibold">Room Type:</p>
                  <p>{selectedHotel.roomType}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedHotel.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Bookings ({selectedHotel.bookings.length}):</p>
                {selectedHotel.bookings.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {selectedHotel.bookings.map((booking, index) => (
                      <li key={index} className="mt-2">
                        <p>Dates: {booking.checkIn} to {booking.checkOut}</p>
                        <p>Guests: {booking.guests}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No bookings yet</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Manage_Hotel;