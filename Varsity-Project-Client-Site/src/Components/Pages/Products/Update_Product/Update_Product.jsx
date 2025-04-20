import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, Typography, Card, CardHeader, CardBody, CardFooter } from "@material-tailwind/react";
import axios from "axios";

const Update_Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminData = location.state?.adminData || {};

  const [formData, setFormData] = useState({
    productName: adminData.productName || "",
    category: adminData.category || "",
    defaultPrice: adminData.defaultPrice || "",
    price: adminData.price || "",
    createDate: adminData.createDate || "",
    image: adminData.image || "",
  });

  const [imagePreview, setImagePreview] = useState(adminData.image || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
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

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input for image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit to 2MB
        setErrors({ ...errors, image: "File size exceeds 2MB" });
        setImagePreview(null);  // Clear preview on error
      } else if (!file.type.startsWith("image/")) { // Check if it's an image file
        setErrors({ ...errors, image: "Only image files are allowed" });
        setImagePreview(null);  // Clear preview on error
      } else {
        setErrors({ ...errors, image: "" });  // Clear error if valid image
        setImagePreview(URL.createObjectURL(file));
        setFormData((prevData) => ({
          ...prevData,
          image: file, // Store the file object for later upload
        }));
      }
    }
  };

  const handleImageUpload = async (imageFile) => {
    try {
      // Create a FormData object to send the image file
      const formDataToUpload = new FormData();
      formDataToUpload.append("image", imageFile);

      // Make a request to ImgBB to upload the image
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_APIKEY}`,
        formDataToUpload
      );

      if (response.data.success) {
        return response.data.data.display_url;
      } else {
        throw new Error("Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image to ImgBB.");
      return null;  // Return null if image upload fails
    }
  };

  const handleUpdate = async () => {
    // Basic validation for required fields
    if (!formData.productName || !formData.price) {
      setErrors({
        productName: !formData.productName ? "Product Name is required." : "",
        price: !formData.price ? "Price is required." : "",
      });
      return;
    }

    setLoading(true); // Set loading state

    try {
      let imageUrl = formData.image; // Default to the current image URL if no new image is selected

      // If a new image file is selected, upload it to ImgBB
      if (formData.image && formData.image instanceof File) {
        imageUrl = await handleImageUpload(formData.image); // Upload new image to ImgBB
        if (!imageUrl) {
          setLoading(false); // Stop loading state if image upload fails
          return; // Stop the update if image upload fails
        }
      }

      // Prepare form data for the update request
      const updateData = {
        productName: formData.productName,
        category: formData.category,
        defaultPrice: formData.defaultPrice,
        price: formData.price,
        createDate: formData.createDate,
        image: imageUrl,
      };

      const response = await axios.put(`http://localhost:5000/product-update/${adminData._id}`, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Product updated successfully!");
        navigate("/dashboard/manage-product");
      } else {
        alert("Failed to update product. Please try again.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full sm:w-full md:w-full lg:w-2/3 p-8 rounded-lg shadow-lg">
        <CardHeader floated={false} shadow={false} className="rounded-none text-center">
          <Typography variant="h5" className="font-semibold text-blue-600">
            Update Product Information
          </Typography>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Product Name"
            value={formData.productName}
            name="productName"
            onChange={handleInputChange}
            className={`mb-4 ${errors.productName ? "border-red-400" : ""}`}
            required
          />
          {errors.productName && <span className="text-xs text-red-400">{errors.productName}</span>}

          {/* Category Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-2 w-full p-2 border rounded-md bg-white border-gray-400"
            >
              <option value="">Select a Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <Input
            label="Default Price"
            value={formData.defaultPrice}
            name="defaultPrice"
            onChange={handleInputChange}
            className={`mb-4 ${errors.defaultPrice ? "border-red-400" : ""}`}
            required
          />

          <Input
            label="Price"
            value={formData.price}
            name="price"
            onChange={handleInputChange}
            className={`mb-4 ${errors.price ? "border-red-400" : ""}`}
            required
          />
          {errors.price && <span className="text-xs text-red-400">{errors.price}</span>}

          {/* Image upload input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`mt-2 w-full ${errors.image ? "border-red-400" : ""}`}
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Image Preview" className="w-32 h-32 object-cover" />
              </div>
            )}
          </div>
          {errors.image && <span className="text-xs text-red-400">{errors.image}</span>}

          <Input
            label="Creation Date"
            value={formData.createDate}
            name="createDate"
            disabled
            className="mb-4"
          />
        </CardBody>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleUpdate}
            className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 px-4 rounded-md transition duration-300`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Update_Product;
