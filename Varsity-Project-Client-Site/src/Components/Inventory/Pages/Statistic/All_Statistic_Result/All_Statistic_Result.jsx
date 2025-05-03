import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const All_Statistic_Result = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        agencies: 0,
        regularUsers: 0,
        totalProducts: 0,
        totalHotels: 0,
        totalVehicles: 0,
        totalTours: 0,
        activeHotels: 0,
        activeVehicles: 0,
        activeTours: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API calls
        const fetchData = async () => {
            try {
                // In a real app, you would fetch these from your APIs
                const registrationRes = await fetch('https://varsity-project-server-site.vercel.app/registration');
                const registrations = await registrationRes.json();
                
                const productRes = await fetch('https://varsity-project-server-site.vercel.app/product');
                const products = await productRes.json();
                
                const hotelRes = await fetch('https://varsity-project-server-site.vercel.app/hotel');
                const hotels = await hotelRes.json();
                
                const vehicleRes = await fetch('https://varsity-project-server-site.vercel.app/vehicles');
                const vehicles = await vehicleRes.json();
                
                const tourRes = await fetch('https://varsity-project-server-site.vercel.app/tour');
                const tours = await tourRes.json();

                // Process data
                const agencies = registrations.filter(r => r.agency === "approved").length;
                const regularUsers = registrations.length - agencies;
                const activeHotels = hotels.filter(h => h.permission === "yes").length;
                const activeVehicles = vehicles.filter(v => v.permission === "yes").length;
                const activeTours = tours.filter(t => t.permission === "yes").length;

                setStats({
                    totalUsers: registrations.length,
                    agencies,
                    regularUsers,
                    totalProducts: products.length,
                    totalHotels: hotels.length,
                    totalVehicles: vehicles.length,
                    totalTours: tours.length,
                    activeHotels,
                    activeVehicles,
                    activeTours
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Data for charts
    const userData = [
        { name: 'Agencies', value: stats.agencies },
        { name: 'Users', value: stats.regularUsers }
    ];

    const serviceData = [
        { name: 'Hotels', value: stats.activeHotels },
        { name: 'Vehicles', value: stats.activeVehicles },
        { name: 'Tours', value: stats.activeTours },
        { name: 'Products', value: stats.totalProducts }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard Statistics</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                    title="Total Users" 
                    value={stats.totalUsers} 
                    icon="👥" 
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard 
                    title="Agencies" 
                    value={stats.agencies} 
                    icon="🏢" 
                    color="bg-purple-100 text-purple-600"
                />
                <StatCard 
                    title="Active Hotels" 
                    value={stats.activeHotels} 
                    icon="🏨" 
                    color="bg-green-100 text-green-600"
                />
                <StatCard 
                    title="Active Vehicles" 
                    value={stats.activeVehicles} 
                    icon="🚗" 
                    color="bg-yellow-100 text-yellow-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* User Distribution Pie Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">User Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {userData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Services Bar Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Services Overview</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={serviceData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Statistics */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Detailed Statistics</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inactive</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Hotels</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.totalHotels}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{stats.activeHotels}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{stats.totalHotels - stats.activeHotels}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Vehicles</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.totalVehicles}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{stats.activeVehicles}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{stats.totalVehicles - stats.activeVehicles}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tours</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.totalTours}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{stats.activeTours}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{stats.totalTours - stats.activeTours}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className={`p-4 rounded-lg shadow-sm ${color} flex items-center justify-between`}>
            <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <span className="text-3xl">{icon}</span>
        </div>
    );
};

export default All_Statistic_Result;