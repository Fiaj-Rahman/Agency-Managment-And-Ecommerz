import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSave, FaSpinner } from "react-icons/fa";
import moment from "moment";

const Edit_Tour_Plan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tour data from location state if available
  const tourData = location.state?.tourData;
  
  const [loading, setLoading] = useState(!tourData);
  const [updating, setUpdating] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [formData, setFormData] = useState({
    touristSpotName: tourData?.touristSpotName || "",
    touristSpotDetails: tourData?.touristSpotDetails || "",
    totalTourPrice: tourData?.totalTourPrice?.replace('৳', '') || "",
    price: tourData?.price?.replace('৳', '') || "",
    startDate: tourData?.startDate || "",
    endDate: tourData?.endDate || "",
    images: tourData?.images || [],
  });

  const [errors, setErrors] = useState({
    touristSpotName: "",
    touristSpotDetails: "",
    totalTourPrice: "",
    price: "",
    startDate: "",
    endDate: "",
    images: "",
  });

  useEffect(() => {
    if (!tourData) {
      const fetchTourData = async () => {
        try {
          const response = await axios.get(`https://varsity-project-server-site.vercel.app/tour/${id}`);
          const data = response.data;
          
          setFormData({
            touristSpotName: data.touristSpotName,
            touristSpotDetails: data.touristSpotDetails,
            totalTourPrice: data.totalTourPrice.replace('৳', ''),
            price: data.price.replace('৳', ''),
            startDate: data.startDate,
            endDate: data.endDate,
            images: data.images || [],
          });
          
          setImagePreviews(data.images || []);
        } catch (error) {
          toast.error("Failed to load tour data");
          console.error("Error fetching tour:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTourData();
    } else {
      setImagePreviews(tourData.images || []);
    }
  }, [id, tourData]);

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();

    if (!formData.touristSpotName.trim()) {
      newErrors.touristSpotName = "Tourist Spot Name is required";
    }
    if (!formData.touristSpotDetails.trim()) {
      newErrors.touristSpotDetails = "Details are required";
    }
    if (!formData.totalTourPrice) {
      newErrors.totalTourPrice = "Total Tour Price is required";
    }
    if (!formData.price) {
      newErrors.price = "Discount Price is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End Date is required";
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End Date must be after Start Date";
    }
    if (new Date(formData.startDate) < currentDate.setHours(0, 0, 0, 0)) {
      newErrors.startDate = "Start Date cannot be in the past";
    }
    if (imagePreviews.length === 0) {
      newErrors.images = "At least one image is required";
    }

    return newErrors;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setErrors({ ...errors, images: "Maximum 5 images allowed" });
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, images: "File size exceeds 2MB" });
        return false;
      }
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, images: "Only image files are allowed" });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setErrors({ ...errors, images: "" });

      const previews = validFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews.slice(0, 5 - prev.length)]);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles].slice(0, 5),
      }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];

    // Check if the image is a new upload or existing URL
    if (index >= formData.images.length) {
      // It's a new image (from file upload)
      const newFiles = [...newImages];
      newFiles.splice(index - formData.images.length, 1);
      setNewImages(newFiles);
    } else {
      // It's an existing image (URL)
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
    }

    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  };

  const handleTotalPriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, totalTourPrice: value });
    }
  };

  const uploadImages = async (images) => {
    const uploadPromises = images.map(async (image) => {
      // If it's already a URL (existing image), return it
      if (typeof image === 'string') return image;
      
      // Otherwise, upload new image
      const imageFormData = new FormData();
      imageFormData.append("image", image);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_APIKEY}`,
        imageFormData
      );
      return response.data.data.display_url;
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setUpdating(true);

        // Upload new images if any
        let allImageUrls = [...formData.images];
        if (newImages.length > 0) {
          const uploadedUrls = await uploadImages(newImages);
          allImageUrls = [...allImageUrls, ...uploadedUrls];
        }

        const tourData = {
          touristSpotName: formData.touristSpotName,
          touristSpotDetails: formData.touristSpotDetails,
          totalTourPrice: `${formData.totalTourPrice}৳`,
          price: `${formData.price}৳`,
          startDate: formData.startDate,
          endDate: formData.endDate,
          images: allImageUrls,
          updatedAt: new Date().toISOString()
        };

        await axios.put(`https://varsity-project-server-site.vercel.app/update-tour/${id}`, tourData);
        toast.success("Tour updated successfully!");
        navigate("/dashboard/manage-tour-plan");
      } catch (error) {
        toast.error("Error updating tour");
        console.error("Update error:", error);
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Update Tour Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tourist Spot Name */}
          <div className="relative group">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="touristSpotName"
                  className="block text-sm text-gray-900 font-bold mb-1"
                >
                  Tourist Spot Name
                </label>
                <input
                  type="text"
                  id="touristSpotName"
                  className="w-full px-4 py-3 rounded-lg border bg-gray-300 text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 placeholder-gray-400"
                  placeholder="Enter spot name"
                  value={formData.touristSpotName}
                  onChange={(e) =>
                    setFormData({ ...formData, touristSpotName: e.target.value })
                  }
                />
                {errors.touristSpotName && (
                  <span className="text-red-500 text-sm">
                    {errors.touristSpotName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tourist Spot Details */}
          <div className="relative group">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="touristSpotDetails"
                  className="block text-sm text-gray-900 font-bold mb-1"
                >
                  Tour Details
                </label>
                <textarea
                  id="touristSpotDetails"
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-300 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 placeholder-gray-400"
                  placeholder="Describe the tour details..."
                  value={formData.touristSpotDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, touristSpotDetails: e.target.value })
                  }
                />
                {errors.touristSpotDetails && (
                  <span className="text-red-500 text-sm">
                    {errors.touristSpotDetails}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Tour Price */}
            <div className="relative group">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="totalTourPrice"
                    className="block text-sm text-gray-900 font-bold mb-1"
                  >
                    Total Tour Price
                  </label>
                  <input
                    type="number"
                    id="totalTourPrice"
                    className="w-full px-4 py-3 rounded-lg border bg-gray-300 text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    placeholder="Total price"
                    value={formData.totalTourPrice}
                    onChange={handleTotalPriceChange}
                  />
                  {errors.totalTourPrice && (
                    <span className="text-red-500 text-sm">
                      {errors.totalTourPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Discount Price */}
            <div className="relative group">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="price"
                    className="block text-sm text-gray-900 font-bold mb-1"
                  >
                    Discount Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="w-full px-4 py-3 rounded-lg border bg-gray-300 text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    placeholder="Discounted price"
                    value={formData.price}
                    onChange={handlePriceChange}
                  />
                  {errors.price && (
                    <span className="text-red-500 text-sm">{errors.price}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="relative group">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="startDate"
                    className="block text-sm text-gray-900 font-bold mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full px-4 py-3 rounded-lg border bg-gray-300 text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                  {errors.startDate && (
                    <span className="text-red-500 text-sm">
                      {errors.startDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* End Date */}
            <div className="relative group">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="endDate"
                    className="block text-sm text-gray-900 font-bold mb-1"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full px-4 py-3 rounded-lg border bg-gray-300 text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                  {errors.endDate && (
                    <span className="text-red-500 text-sm">
                      {errors.endDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="relative group">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Images
                </label>
                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
                    errors.images
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <div className="space-y-1 text-center">
                    {imagePreviews.length > 0 ? (
                      <div className="flex flex-wrap gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              className="h-32 w-32 object-cover rounded-lg shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="images"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload files</span>
                            <input
                              id="images"
                              name="images"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 2MB, max 5 images
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {errors.images && (
                  <span className="text-red-500 text-sm">{errors.images}</span>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={updating}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {updating ? (
                <div className="flex items-center justify-center space-x-2">
                  <FaSpinner className="animate-spin h-5 w-5 text-white" />
                  <span>Updating Tour...</span>
                </div>
              ) : (
                "Update Tour Plan →"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit_Tour_Plan;