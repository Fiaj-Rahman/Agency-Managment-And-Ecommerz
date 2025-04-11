import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography, Button, CardBody, Avatar, IconButton, Tooltip, CardFooter } from "@material-tailwind/react";
import { Link } from "react-router-dom"; // Use react-router-dom Link
import { FaEye } from "react-icons/fa";

// List of all categories for filtering
const CATEGORIES = [
    "Electronics", "Smartphones", "Laptops", "Tablets", "TVs", "Headphones", "Wearable Technology (e.g., Smartwatches)",
    "Cameras", "Fashion & Apparel", "Men’s Clothing", "Women’s Clothing", "Shoes", "Accessories (e.g., Bags, Hats, Scarves)",
    "Jewelry", "Activewear", "Beauty & Personal Care", "Skincare", "Haircare", "Makeup", "Fragrances", "Health & Wellness Products",
    "Grooming Tools", "Home & Living", "Furniture", "Home Decor", "Kitchen Appliances", "Bedding & Linens", "Lighting Fixtures",
    "Rugs & Carpets", "Toys & Games", "Action Figures", "Board Games", "Dolls", "Puzzles", "Outdoor Play Equipment",
    "Educational Toys", "Health & Fitness", "Supplements", "Exercise Equipment", "Apparel (e.g., Gym Clothes)",
    "Sports Accessories", "Yoga & Meditation Gear", "Books & Media", "Fiction", "Non-Fiction", "Educational Books",
    "E-books", "Magazines", "Music & Movies (CDs, DVDs)", "Food & Beverages", "Snacks", "Beverages (e.g., Soft Drinks, Juices)",
    "Dairy Products", "Groceries", "Organic & Specialty Foods", "Automotive & Tools", "Car Parts & Accessories",
    "Motorbikes & Accessories", "Tools & Equipment", "Car Care Products", "Electronics for Cars (e.g., GPS, Dashcams)",
    "Office Supplies & Stationery", "Office Furniture", "Paper Products", "Writing Tools (Pens, Pencils)",
    "Organizational Items (Binders, Files)", "Tech Accessories (Keyboards, Mice)", "Sports & Outdoors", "Camping & Hiking Gear",
    "Bicycles & Accessories", "Outdoor Furniture", "Fishing & Hunting Gear", "Team Sports Equipment", "Pet Supplies",
    "Pet Food & Treats", "Pet Toys", "Pet Grooming Products", "Pet Accessories (e.g., Leashes, Beds)", "Pet Health Products (e.g., Flea & Tick Solutions)",
    "Baby Products", "Diapers & Wipes", "Baby Clothes", "Feeding & Nursing", "Baby Gear (Strollers, Car Seats)",
    "Nursery Furniture", "Arts & Crafts", "Art Supplies (e.g., Paint, Brushes)", "Craft Materials (e.g., Paper, Yarn)",
    "DIY Kits", "Sewing & Knitting", "Party Supplies", "Luxury Goods", "Designer Clothing & Accessories", "High-end Jewelry",
    "Luxury Watches", "Premium Bags & Footwear", "Fine Wines & Spirits", "Technology & Software", "Software Applications",
    "Web Development Tools", "Cloud Services", "Hardware (e.g., Servers, Routers)"
];

// Table headers
const TABLE_HEAD = ["Product", "Category", "Price", "Creation Date", "Actions"];

const All_Product_Manage = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Search query state
    const [selectedCategory, setSelectedCategory] = useState("All"); // Selected category for filtering
    const [loading, setLoading] = useState(false);

    // Fetch product data from the API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); // Start loading
            try {
                const response = await fetch("https://varsity-project-server-site.vercel.app/product");
                const data = await response.json();
                setProducts(data); // Set fetched product data
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchProducts();
    }, []);

    // Handle delete
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        setLoading(true); // Start loading

        fetch(`https://varsity-project-server-site.vercel.app/product-delete/${id}`, { method: "DELETE" })
            .then(() => {
                setProducts(products.filter((product) => product._id !== id));
                setLoading(false); // Stop loading after deletion
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                setLoading(false); // Stop loading in case of error
            });
    };




    // Filter products based on search query and selected category
    const filteredProducts = products
        .filter(
            (product) =>
                product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product._id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((product) => {
            if (selectedCategory === "All") return true; // Show all products
            return product.category === selectedCategory; // Show products for the selected category
        });

    // Pagination logic
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div className="mt-10">
            <Card className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 flex items-center justify-between gap-8 flex-wrap">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                            <Typography variant="h5" color="blue-gray">
                                Products List
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                                See information about all products
                            </Typography>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <Link to="/dashboard/create-product">
                                <Button className="flex items-center gap-3" size="sm">
                                    <FaEye className="h-4 w-4" /> Add Product
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="w-full sm:w-80 md:w-96 lg:w-1/2 ">
                            <select
                                className="w-full p-2  bg-white border-blue-gray-500 sm:p-2 md:p-2 lg:p-3 border rounded-md text-sm md:text-base"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full sm:w-80 md:w-96 lg:w-1/2 mt-4 sm:mt-0">
                            <Input
                                label="Search(Product Name/ID)"
                                icon={<FaEye className="h-5 w-5" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-2 sm:p-3 md:p-4 lg:p-4"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="overflow-x-auto px-0">
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map(({ _id, productName, category, price,defaultPrice, createDate, image }, index) => {
                                const isLast = index === currentProducts.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={_id}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Avatar src={image} alt={productName} size="sm" />
                                                <div className="flex flex-col">
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {productName}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {category}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {price}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {createDate}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex gap-2">
                                                <Tooltip content="Edit">
                                                    <Link to={`/dashboard/edit-product/${_id}`} state={{ adminData: { _id, productName, category, price,defaultPrice, createDate, image } }}>
                                                        <IconButton variant="text">
                                                            <PencilIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>


                                                <Link to={`/product/${_id}`}>
                                                    <Tooltip content="View">
                                                        <IconButton variant="text">
                                                            <FaEye className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Link>


                                                <Tooltip content="Delete">
                                                    <IconButton variant="text">
                                                        <TrashIcon className="h-4 w-4 text-red-500" onClick={() => handleDelete(`${_id}`)} />
                                                    </IconButton>
                                                </Tooltip>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>

                {/* Pagination */}
                <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Page {currentPage} of {totalPages}
                    </Typography>
                    <div className="flex gap-2">
                        <Button variant="outlined" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </Button>
                        <Button variant="outlined" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default All_Product_Manage;
