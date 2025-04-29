import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, CalendarIcon, PhotoIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography, Button, CardBody, Avatar, IconButton, Tooltip, CardFooter } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import moment from "moment";

const TABLE_HEAD = ["Tourist Spot", "Prices", "Dates", "Gallery", "Actions"];

const Manage_Tour_Plan = () => {
    const [tours, setTours] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Fetch tour data
    useEffect(() => {
        const fetchTours = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/tour");
                const data = await response.json();
                setTours(data);
            } catch (error) {
                console.error("Error fetching tours:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tour?")) return;
        
        setLoading(true);
        try {
            await fetch(`http://localhost:5000/tour-delete/${id}`, { method: "DELETE" });
            setTours(tours.filter(tour => tour._id !== id));
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Search and pagination
    const filteredTours = tours.filter(tour =>
        tour.touristSpotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentTours = filteredTours.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredTours.length / itemsPerPage);

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
            <Card className="shadow-xl rounded-xl overflow-hidden">
                <CardHeader floated={false} shadow={false} className="bg-blue-900/10">
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <Typography variant="h4" className="text-2xl md:text-3xl font-bold text-blue-900">
                                Manage Tour Plans
                            </Typography>
                            <Typography className="mt-2 text-gray-600">
                                {filteredTours.length} tours available
                            </Typography>
                        </div>
                        
                        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
                            <Link to="/dashboard/create-tour-plan" className="w-full md:w-auto">
                                <Button className="bg-blue-900 hover:bg-blue-800 flex items-center gap-2 w-full">
                                    <FaPlus className="h-4 w-4" /> New Tour
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
                                {currentTours.map((tour) => (
                                    <tr key={tour._id} className="hover:bg-blue-50/50 transition-colors">
                                        {/* Tourist Spot */}
                                        <td className="p-4 border-b border-blue-100">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <PhotoIcon className="h-6 w-6 text-blue-900" />
                                                </div>
                                                <div>
                                                    <Typography variant="h6" className="font-semibold">
                                                        {tour.touristSpotName}
                                                    </Typography>
                                                    <Typography variant="small" className="text-gray-600">
                                                        {tour._id}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>


                                        {/* Prices */}
                                        <td className="p-4 border-b border-blue-100">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                                                    <span className="line-through text-gray-500">
                                                        {tour.totalTourPrice}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CurrencyDollarIcon className="h-4 w-4 text-red-600" />
                                                    <span className="font-semibold text-blue-900">
                                                        {tour.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Dates */}
                                        <td className="p-4 border-b border-blue-100">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                                                    {moment(tour.startDate).format("MMM Do")}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                                                    {moment(tour.endDate).format("MMM Do YYYY")}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Gallery */}
                                        <td className="p-4 border-b border-blue-100">
                                            <div className="flex -space-x-2">
                                                {tour.images.slice(0,3).map((img, idx) => (
                                                    <Avatar
                                                        key={idx}
                                                        src={img}
                                                        alt={`Gallery ${idx}`}
                                                        className="border-2 border-white hover:z-10 hover:scale-110 transition-all"
                                                    />
                                                ))}
                                                {tour.images.length > 3 && (
                                                    <Avatar className="bg-blue-100 text-blue-900 border-2 border-white">
                                                        +{tour.images.length - 3}
                                                    </Avatar>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 border-b border-blue-100">
                                            <div className="flex gap-2">
                                                <Tooltip content="Edit">
                                                    <Link to={`/dashboard/edit-tour/${tour._id}`}>
                                                        <IconButton variant="text" className="text-blue-900 hover:bg-blue-100">
                                                            <PencilIcon className="h-5 w-5" />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>

                                                <Tooltip content="Delete">
                                                    <IconButton 
                                                        variant="text" 
                                                        className="text-red-600 hover:bg-red-100"
                                                        onClick={() => handleDelete(tour._id)}
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
                        Showing {currentTours.length} of {filteredTours.length} results
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
        </div>
    );
};

export default Manage_Tour_Plan;
















