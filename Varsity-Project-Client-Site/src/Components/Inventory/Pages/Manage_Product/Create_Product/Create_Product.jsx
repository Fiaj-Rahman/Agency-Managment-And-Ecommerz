import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // for displaying notifications

const Create_Product = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    productName: "",
    description: "",
    image: "",
    price: "",
    defaultPrice: "",
    category: "",
  });

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    defaultPrice: "",
    category: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null); // Image preview
  const [loading, setLoading] = useState(false); // Loading state for form submission

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName) newErrors.productName = "Product Name is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData. defaultPrice) newErrors.defaultPrice = "Default Price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.image) {
      newErrors.image = "Image is required";
    } else if (!formData.image.type.startsWith("image/")) {
      newErrors.image = "File must be an image";
    }

    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: "File size exceeds 2MB" });
        setImagePreview(null);
      } else if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Only image files are allowed" });
        setImagePreview(null);
      } else {
        setErrors({ ...errors, image: "" });
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Only allow numeric values
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, price: value});
    }
  };

    const handledefaultPriceChange = (e) => {
    const value = e.target.value;
    // Only allow numeric values
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, defaultPrice: value});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        setErrors({ ...errors, general: "" });

        const imageFormData = new FormData();
        imageFormData.append("image", formData.image);
        const imageResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_APIKEY}`,
          imageFormData
        );
        const imageUrl = imageResponse.data.data.display_url;

        const currentDateTime = new Date();
        const createDate = currentDateTime.toLocaleDateString();
        const createTime = currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

        const productData = {
          productName: formData.productName,
          description: formData.description,
          price: `${formData.price}৳`, // Add the symbol after the price
          defaultPrice:`${formData.defaultPrice}৳`,
          category: formData.category,
          image: imageUrl,
          createDate,
          createTime
        };

        const response = await axios.post("http://localhost:5000/product", productData);

        if (response.data.success) {
          toast.success("Product created successfully!");
          navigate("/dashboard/manage-product");
        }

        setLoading(false);
        e.target.reset();
        setImagePreview(null);
      } catch (error) {
        setLoading(false);
        setErrors({ ...errors, general: error.message });
        toast.success("Product created successfully!");
        navigate("/dashboard/manage-product");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
    <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Create New Product
    </h2>
    
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Product Name */}
      <div className="relative group">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div className="flex-1">
            <label htmlFor="productName" className="block text-sm text-gray-900 font-bold  mb-1">Product Name</label>
            <input
              type="text"
              id="productName"
              className="w-full px-4 py-3 rounded-lg border bg-gray-300 text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 placeholder-gray-400"
              placeholder="Product Name"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>
        </div>
        {errors.productName && (
          <div className="mt-2 ml-13 flex items-center text-red-600 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {errors.productName}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="relative group">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className="flex-1">
            <label htmlFor="description" className="block text-sm text-gray-900 font-bold  mb-1">Description</label>
            <textarea
              id="description"
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 placeholder-gray-400 bg-gray-300 text-black"
              placeholder="Describe your product features and benefits..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Price */}
        <div className="relative group">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="flex-1">
              <label htmlFor="defaultPrice" className="block text-sm text-gray-900 font-bold   mb-1">Original Price</label>
              <div className="relative">
                <input
                  type="number"
                  id="defaultPrice"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-300 text-black"
                  placeholder="0.00"
                  value={formData.defaultPrice}
                  onChange={handledefaultPriceChange}
                />
                <span className="absolute left-3 top-3 text-gray-400">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selling Price */}
        <div className="relative group">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div className="flex-1">
              <label htmlFor="price" className="block text-sm text-gray-900 font-bold  mb-1">Discount Price</label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-300 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handlePriceChange}
                />
                <span className="absolute left-3 top-3 text-gray-400">$</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selector */}
      <div className="relative group">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
          </div>
          <div className="flex-1">
            <label htmlFor="category" className="block text-sm text-gray-900 font-bold mb-1">Product Category</label>
            <select
              id="category"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-300 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 appearance-none bg-no-repeat bg-right pr-10"
              style={{backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,<svg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E")'}}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Choose a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category} className="py-2">{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="relative group">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all duration-300 ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-500'}`}>
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative group">
                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg shadow-sm"/>
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-10">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating Product...</span>
            </div>
          ) : (
            'Create Product →'
          )}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default Create_Product;
