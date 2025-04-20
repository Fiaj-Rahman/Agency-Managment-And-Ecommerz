import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const All_Tour_Plan = () => {
  const [tours, setTours] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("http://localhost:5000/tour");
        if (!response.ok) throw new Error("Failed to fetch tours");
        const data = await response.json();
        setTours(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  const filteredTours = tours.filter((tour) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tourEndDate = new Date(tour.endDate);
    tourEndDate.setHours(0, 0, 0, 0);

    return (
      tour.touristSpotName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      tourEndDate >= today
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Explore Our Tour Plans
          </h2>
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search tour destinations..."
              className="w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute right-3 top-3 h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {filteredTours.length === 0 ? (
          <div className="text-center text-gray-500 text-xl mt-12">
            No available tours found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <Link to={`/tour-plan/${tour._id}`}> 
                <div
                key={tour._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={tour.images[0]}
                    alt={tour.touristSpotName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  <span className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    {tour.price}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {tour.touristSpotName}
                  </h3>
                  <p className="text-gray-600 mb-4">
  {tour.touristSpotDetails?.slice(0, 50)}{tour.touristSpotDetails?.length > 50 && "..."}
</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                      <p className="font-medium">
                        {format(new Date(tour.startDate), "dd MMM yyyy")}
                      </p>
                      <p className="text-xs">Start Date</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-blue-500">→</p>
                    </div>
                    <div>
                      <p className="font-medium">
                        {format(new Date(tour.endDate), "dd MMM yyyy")}
                      </p>
                      <p className="text-xs">End Date</p>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default All_Tour_Plan;