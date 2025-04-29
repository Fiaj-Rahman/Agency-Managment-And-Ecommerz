import React, { useEffect, useState } from 'react';

const TourApprove = () => {
  const [tours, setTours] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [tourName, setTourName] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/tour')
      .then(res => res.json())
      .then(data => setTours(data.filter(tour => tour.permission !== "yes")));
  }, []);

  const handleApprove = (id, name) => {
    setSelectedTourId(id);
    setTourName(name);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tour/${selectedTourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission: "yes" }),
      });

      if (response.ok) {
        setTours(tours.filter(tour => tour._id !== selectedTourId));
        alert('Tour approved successfully!');
      }
      setShowApproveModal(false);
    } catch (error) {
      console.error('Error approving tour:', error);
      setShowApproveModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        const response = await fetch(`http://localhost:5000/tour/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTours(tours.filter(tour => tour._id !== id));
          alert('Tour deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting tour:', error);
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
              Are you sure you want to approve <strong>{tourName}</strong>?
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

      <h1 className="text-3xl font-bold text-center mb-8">Pending Tour Approvals</h1>
      
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">SL No</th>
              <th className="py-3 px-6 text-left">Tourist Spot</th>
              <th className="py-3 px-6 text-left">Details</th>
              <th className="py-3 px-6 text-left">Total Price</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Start Date</th>
              <th className="py-3 px-6 text-left">End Date</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {tours.map((tour, index) => (
              <tr key={tour._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left">{tour.touristSpotName}</td>
                <td className="py-3 px-6 text-left">{tour.touristSpotDetails}</td>
                <td className="py-3 px-6 text-left">{tour.totalTourPrice}</td>
                <td className="py-3 px-6 text-left">{tour.price}</td>
                <td className="py-3 px-6 text-left">{tour.startDate}</td>
                <td className="py-3 px-6 text-left">{tour.endDate}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(tour._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                    
                    <button
                      onClick={() => handleApprove(tour._id, tour.touristSpotName)}
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
        {tours.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No tours pending approval
          </div>
        )}
      </div>
    </div>
  );
};

export default TourApprove;