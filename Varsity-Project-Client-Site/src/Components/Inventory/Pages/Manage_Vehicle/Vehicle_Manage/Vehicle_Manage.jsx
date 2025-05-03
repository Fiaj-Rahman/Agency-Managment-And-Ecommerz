import React, { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, CurrencyDollarIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography, Button, CardBody, Avatar, IconButton, Tooltip, CardFooter } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const TABLE_HEAD = ["Vehicle", "Details", "Pricing", "Status", "Gallery", "Actions"];

const Vehicle_Manage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/vehicles");
      setVehicles(response.data);
    } catch (error) {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/vehicles/${id}`);
      toast.success("Vehicle deleted successfully");
      setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
    } catch (error) {
      toast.error("Failed to delete vehicle");
    } finally {
      setLoading(false);
    }
  };


  // Search and pagination
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader floated={false} shadow={false} className="bg-blue-900/10">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Typography variant="h4" className="text-2xl md:text-3xl font-bold text-blue-900">
                Manage Vehicles
              </Typography>
              <Typography className="mt-2 text-gray-600">
                {filteredVehicles.length} vehicles available
              </Typography>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
              <Link to="/dashboard/create-vehicle" className="w-full md:w-auto">
                <Button className="bg-blue-900 hover:bg-blue-800 flex items-center gap-2 w-full">
                  <FaPlus className="h-4 w-4" /> New Vehicle
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
                {currentVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-blue-50/50 transition-colors">
                    {/* Vehicle Info */}
                    <td className="p-4 border-b border-blue-100">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={vehicle.images?.[0] || '/placeholder-vehicle.jpg'}
                          alt={vehicle.vehicleName}
                          className="border-2 border-white"
                        />
                        <div>
                          <Typography variant="h6" className="font-semibold">
                            {vehicle.vehicleName}
                          </Typography>
                          <Typography variant="small" className="text-gray-600">
                            {vehicle.brand} {vehicle.model}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="p-4 border-b border-blue-100">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <ChartBarIcon className="h-4 w-4 text-blue-600" />
                          {vehicle.vehicleType}
                        </div>
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="h-4 w-4 text-green-600" />
                          {vehicle.seats} Seats
                        </div>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="p-4 border-b border-blue-100">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">
                            ৳{vehicle.pricePerHour}/hour
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">
                            ৳{vehicle.pricePerDay}/day
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 border-b border-blue-100">
                      <span className={`px-2 py-1 rounded-full text-sm ${vehicle.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {vehicle.status}
                      </span>
                    </td>

                    {/* Gallery */}
                    <td className="p-4 border-b border-blue-100">
                      <div className="flex -space-x-2">
                        {vehicle.images.slice(0, 3).map((img, idx) => (
                          <Avatar
                            key={idx}
                            src={img}
                            alt={`Gallery ${idx}`}
                            className="border-2 border-white hover:z-10 hover:scale-110 transition-all"
                          />
                        ))}
                        {vehicle.images.length > 3 && (
                          <Avatar className="bg-blue-100 text-blue-900 border-2 border-white">
                            +{vehicle.images.length - 3}
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
                            onClick={() => setSelectedVehicle(vehicle)}
                          >
                            <FaEye className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip content="Edit">
                          <Link
                            to={`/dashboard/update-vehicle/${vehicle._id}`}
                            state={{ vehicleData: vehicle }}  // Pass the vehicle data here
                          >
                            <IconButton variant="text" className="text-blue-900 hover:bg-blue-100">
                              <PencilIcon className="h-5 w-5" />
                            </IconButton>
                          </Link>
                        </Tooltip>

                        <Tooltip content="Delete">
                          <IconButton
                            variant="text"
                            className="text-red-600 hover:bg-red-100"
                            onClick={() => handleDelete(vehicle._id)}
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
            Showing {currentVehicles.length} of {filteredVehicles.length} results
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

      {/* View Modal (Keep your existing modal structure here) */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedVehicle.vehicleName}</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">Brand:</p>
                <p>{selectedVehicle.brand}</p>
              </div>
              <div>
                <p className="font-semibold">Model:</p>
                <p>{selectedVehicle.model}</p>
              </div>
              <div>
                <p className="font-semibold">Type:</p>
                <p>{selectedVehicle.vehicleType}</p>
              </div>
              <div>
                <p className="font-semibold">Transmission:</p>
                <p>{selectedVehicle.transmission}</p>
              </div>
              <div>
                <p className="font-semibold">Fuel Type:</p>
                <p>{selectedVehicle.fuelType}</p>
              </div>
              <div>
                <p className="font-semibold">Seats:</p>
                <p>{selectedVehicle.seats}</p>
              </div>
              <div>
                <p className="font-semibold">Price Per Hour:</p>
                <p>৳{selectedVehicle.pricePerHour}</p>
              </div>
              <div>
                <p className="font-semibold">Price Per Day:</p>
                <p>৳{selectedVehicle.pricePerDay}</p>
              </div>
              <div>
                <p className="font-semibold">Location:</p>
                <p>{selectedVehicle.location}</p>
              </div>
              <div>
                <p className="font-semibold">District:</p>
                <p>{selectedVehicle.district}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold">Features:</p>
              <div className="flex flex-wrap gap-2">
                {selectedVehicle.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold">Description:</p>
              <p className="text-gray-600">{selectedVehicle.description}</p>
            </div>

            <div className="mb-4">
              <p className="font-semibold">Bookings ({selectedVehicle.bookings.length}):</p>
              {selectedVehicle.bookings.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedVehicle.bookings.map((booking, index) => (
                    <li key={index} className="mt-2">
                      <p>Dates: {booking.checkIn} to {booking.checkOut}</p>
                      <p>Hours: {booking.duration} hours</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No bookings yet</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedVehicle(null)}
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

export default Vehicle_Manage;