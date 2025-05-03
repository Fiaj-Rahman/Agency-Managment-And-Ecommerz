import React, { useEffect, useState } from 'react';

const Vehicle_Approve = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [vehicleName, setVehicleName] = useState('');
  
    useEffect(() => {
        fetch('https://varsity-project-server-site.vercel.app/vehicles')
            .then(res => res.json())
            .then(data => setVehicles(data.filter(vehicle => vehicle.permission !== "yes")))
    }, []);

    const handleApprove = async (id, name) => {
        setSelectedVehicleId(id);
        setVehicleName(name);
        setShowApproveModal(true);
      };

    const confirmApprove = async () => {
        try {
          const response = await fetch(`https://varsity-project-server-site.vercel.app/vehicles/${selectedVehicleId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ permission: "yes" }),
          });
    
          if (response.ok) {
            setVehicles(vehicles.filter(vehicle => vehicle._id !== selectedVehicleId));
            alert('Vehicle approved successfully!');
          }
          setShowApproveModal(false);
        } catch (error) {
          console.error('Error approving vehicle:', error);
          setShowApproveModal(false);
        }
      };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                const response = await fetch(`https://varsity-project-server-site.vercel.app/vehicles/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
                    alert('Vehicle deleted successfully!');
                }
            } catch (error) {
                console.error('Error deleting vehicle:', error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Approval</h3>
            <p className="mb-4">
              Are you sure you want to approve <strong>{vehicleName}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowApproveModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
            <h1 className="text-3xl font-bold text-center mb-8">Pending Vehicle Approvals</h1>

            <div className="overflow-x-auto">
                <table className="table-auto w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">SL No</th>
                            <th className="py-3 px-6 text-left">Vehicle Name</th>
                            <th className="py-3 px-6 text-left">Brand</th>
                            <th className="py-3 px-6 text-left">Model</th>
                            <th className="py-3 px-6 text-left">Type</th>
                            <th className="py-3 px-6 text-left">Transmission</th>
                            <th className="py-3 px-6 text-left">Fuel Type</th>
                            <th className="py-3 px-6 text-left">Price/Hour</th>
                            <th className="py-3 px-6 text-left">Price/Day</th>
                            <th className="py-3 px-6 text-left">Location</th>
                            <th className="py-3 px-6 text-left">District</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {vehicles.map((vehicle, index) => (
                            <tr key={vehicle._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{index + 1}</td>
                                <td className="py-3 px-6 text-left">{vehicle.vehicleName}</td>
                                <td className="py-3 px-6 text-left">{vehicle.brand}</td>
                                <td className="py-3 px-6 text-left">{vehicle.model}</td>
                                <td className="py-3 px-6 text-left">{vehicle.vehicleType}</td>
                                <td className="py-3 px-6 text-left">{vehicle.transmission}</td>
                                <td className="py-3 px-6 text-left">{vehicle.fuelType}</td>
                                <td className="py-3 px-6 text-left">৳{vehicle.pricePerHour}</td>
                                <td className="py-3 px-6 text-left">৳{vehicle.pricePerDay}</td>
                                <td className="py-3 px-6 text-left">{vehicle.location}</td>
                                <td className="py-3 px-6 text-left">{vehicle.district}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => handleDelete(vehicle._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                        
                                        <button
                                            onClick={() => handleApprove(vehicle._id, vehicle.vehicleName)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {vehicles.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No vehicles pending approval
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vehicle_Approve;