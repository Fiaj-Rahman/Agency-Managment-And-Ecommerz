import React, { useEffect, useState } from "react";

const Approve_Agency = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [selectedUser, setSelectedUser] = useState(null); // To store selected user for approval

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/registration");
        const data = await response.json();
        const pendingUsers = data.filter(user => user.agency === "pending");
        setUsers(pendingUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = (user) => {
    setSelectedUser(user); // Set the selected user to be approved
    setShowModal(true); // Show the modal
  };

  const handleConfirmApproval = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:5000/registration/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agency: "approved" }),
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== selectedUser._id)); // Remove approved user from the list
        setShowModal(false); // Close the modal
        alert("Agency approved successfully!");
      } else {
        alert("Error approving user.");
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal without approving
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Approve Agency Requests</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Phone</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Nationality</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Image</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Registration Date</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No pending approval requests
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{user.fullName}</td>
                  <td className="px-6 py-4 border-b">{user.email}</td>
                  <td className="px-6 py-4 border-b">{user.phoneNumber}</td>
                  <td className="px-6 py-4 border-b">{user.nationality}</td>
                  <td className="px-6 py-4 border-b">
                    <img
                      src={user.image}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 border-b">
                    {user.createDate} at {user.createTime}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleApprove(user)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Approval</h2>
            <p>Are you sure you want to approve {selectedUser.fullName}?</p>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleCloseModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approve_Agency;
