import React, { useEffect, useState } from 'react';

const Hotel_Approve = () => {
  const [hotels, setHotels] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [hotelName, setHotelName] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/hotel')
      .then(res => res.json())
      .then(data => setHotels(data.filter(hotel => hotel.permission !== "yes")) )
  }, []);

  const handleApprove = (id, name) => {
    setSelectedHotelId(id);
    setHotelName(name);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    try {
      const response = await fetch(`http://localhost:5000/hotel/${selectedHotelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission: "yes" }),
      });

      if (response.ok) {
        setHotels(hotels.filter(hotel => hotel._id !== selectedHotelId));
        alert('Hotel approved successfully!');
      }
      setShowApproveModal(false);
    } catch (error) {
      console.error('Error approving hotel:', error);
      setShowApproveModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        const response = await fetch(`http://localhost:5000/hotel/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setHotels(hotels.filter(hotel => hotel._id !== id));
          alert('Hotel deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting hotel:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Approval Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Approval</h3>
            <p className="mb-4">
              Are you sure you want to approve <strong>{hotelName}</strong>?
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

      <h1 className="text-3xl font-bold text-center mb-8">Pending Hotel Approvals</h1>
      
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">SL No</th>
              <th className="py-3 px-6 text-left">Hotel Name</th>
              <th className="py-3 px-6 text-left">Location</th>
              <th className="py-3 px-6 text-left">District</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Room Type</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {hotels.map((hotel, index) => (
              <tr key={hotel._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left">{hotel.hotelName}</td>
                <td className="py-3 px-6 text-left">{hotel.location}</td>
                <td className="py-3 px-6 text-left">{hotel.district}</td>
                <td className="py-3 px-6 text-left">${hotel.price}</td>
                <td className="py-3 px-6 text-left">{hotel.roomType}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                   
                    <button
                      onClick={() => handleApprove(hotel._id, hotel.hotelName)}
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
        {hotels.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No hotels pending approval
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotel_Approve;