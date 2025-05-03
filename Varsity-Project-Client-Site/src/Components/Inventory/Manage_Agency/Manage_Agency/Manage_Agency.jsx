import React, { useEffect, useState } from "react";

const Manage_Agency = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedAgencies = async () => {
      try {
        const response = await fetch("https://varsity-project-server-site.vercel.app/registration");
        const data = await response.json();
        const approvedAgencies = data.filter(agency => agency.agency === "approved");
        setAgencies(approvedAgencies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchApprovedAgencies();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading approved agencies...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Approved Agencies ({agencies.length})</h1>
      
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Agency Info</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Contact Details</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Registration Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agencies.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No approved agencies found
                </td>
              </tr>
            ) : (
              agencies.map((agency) => (
                <tr key={agency._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={agency.image}
                        alt={agency.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-medium">{agency.fullName}</div>
                        <div className="text-sm text-gray-500">{agency.nationality}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>{agency.email}</div>
                      <div className="text-gray-500">{agency.phoneNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>{agency.createDate}</div>
                      <div className="text-gray-500">{agency.createTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2">
                      View Details
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                      Revoke
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manage_Agency;