import React, { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, CurrencyDollarIcon, HomeModernIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography, Button, CardBody, Avatar, IconButton, Tooltip, CardFooter } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const TABLE_HEAD = ["Hotel", "Location", "Pricing", "Status", "Gallery", "Actions"];

const Manage_Hotel = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/hotel");
      setHotels(response.data);
    } catch (error) {
      toast.error("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/hotel/${id}`);
      toast.success("Hotel deleted successfully");
      setHotels(hotels.filter(hotel => hotel._id !== id));
    } catch (error) {
      toast.error("Failed to delete hotel");
    } finally {
      setLoading(false);
    }
  };

  // Search and pagination
  const filteredHotels = hotels.filter(hotel =>
    hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader floated={false} shadow={false} className="bg-blue-900/10">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Typography variant="h4" className="text-2xl md:text-3xl font-bold text-blue-900">
                Manage Hotels
              </Typography>
              <Typography className="mt-2 text-gray-600">
                {filteredHotels.length} hotels available
              </Typography>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
              <Link to="/dashboard/create-hotel-room" className="w-full md:w-auto">
                <Button className="bg-blue-900 hover:bg-blue-800 flex items-center gap-2 w-full">
                  <FaPlus className="h-4 w-4" /> New Hotel
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-96">
              <Input
                label="Search by Name or ID"
                icon={<FaSearch className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto">
              <thead className="bg-blue-50">
                <tr>
                  {TABLE_HEAD.map(head => (
                    <th key={head} className="p-4 border-b border-blue-100">
                      <Typography variant="small" className="font-semibold text-blue-900">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {currentHotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-blue-50/50 transition-colors">
                    {/* Hotel Info */}
                    <td className="p-4 border-b border-blue-100">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                          alt={hotel.hotelName}
                          className="border-2 border-white"
                        />
                        <div>
                          <Typography variant="h6" className="font-semibold">
                            {hotel.hotelName}
                          </Typography>
                          <Typography variant="small" className="text-gray-600">
                            {hotel.district}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-4 border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <HomeModernIcon className="h-4 w-4 text-blue-600" />
                        <span className="max-w-[200px] truncate">
                          {hotel.location}
                        </span>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="p-4 border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">
                          ৳{hotel.price}/night
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 border-b border-blue-100">
                      <span className={`px-2 py-1 rounded-full text-sm ${hotel.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {hotel.status}
                      </span>
                    </td>

                    {/* Gallery */}
                    <td className="p-4 border-b border-blue-100">
                      <div className="flex -space-x-2">
                        {hotel.images.slice(0, 3).map((img, idx) => (
                          <Avatar
                            key={idx}
                            src={img}
                            alt={`Gallery ${idx}`}
                            className="border-2 border-white hover:z-10 hover:scale-110 transition-all"
                          />
                        ))}
                        {hotel.images.length > 3 && (
                          <Avatar className="bg-blue-100 text-blue-900 border-2 border-white">
                            +{hotel.images.length - 3}
                          </Avatar>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 border-b border-blue-100">
                      <div className="flex gap-2">
                        <Tooltip content="View">
                          <IconButton
                            variant="text"
                            className="text-blue-900 hover:bg-blue-100"
                            onClick={() => setSelectedHotel(hotel)}
                          >
                            <FaEye className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip content="Edit">
                          <Link
                            to={`/dashboard/update-hotel/${hotel._id}`}
                            state={{ hotelData: hotel }}  // Pass the hotel data through state
                          >
                            <IconButton variant="text" className="text-green-600 hover:bg-green-100">
                              <PencilIcon className="h-5 w-5" />
                            </IconButton>
                          </Link>
                        </Tooltip>

                        <Tooltip content="Delete">
                          <IconButton
                            variant="text"
                            className="text-red-600 hover:bg-red-100"
                            onClick={() => handleDelete(hotel._id)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>

        {/* Pagination */}
        <CardFooter className="flex flex-col md:flex-row justify-between items-center border-t border-blue-100 p-4">
          <Typography className="text-gray-600 mb-2 md:mb-0">
            Showing {currentHotels.length} of {filteredHotels.length} results
          </Typography>

          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

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
                <p className="font-semibold">Capacity:</p>
                <p>{selectedHotel.capacity}</p>
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
  );
};

export default Manage_Hotel;