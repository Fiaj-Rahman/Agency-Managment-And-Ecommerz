import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSave, FaSpinner } from "react-icons/fa";

const Edit_Hotel_Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get hotel data from location state if available
  const hotelData = location.state?.hotelData;
  
  const [loading, setLoading] = useState(!hotelData);
  const [updating, setUpdating] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [formData, setFormData] = useState({
    hotelName: hotelData?.hotelName || "",
    location: hotelData?.location || "",
    district: hotelData?.district || "",
    description: hotelData?.description || "",
    price: hotelData?.price || "",
    roomType: hotelData?.roomType || "Standard",
    amenities: hotelData?.amenities || [],
    capacity: hotelData?.capacity || 1,
    images: hotelData?.images || [],
  });

  const [errors, setErrors] = useState({
    hotelName: "",
    location: "",
    district: "",
    description: "",
    price: "",
    images: "",
  });

  const districts = [
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Rangpur",
    "Mymensingh",
  ];

  const amenitiesList = [
    "Wi-Fi",
    "Air Conditioning",
    "TV",
    "Mini Bar",
    "Room Service",
    "Swimming Pool",
    "Gym",
    "Balcony",
  ];

  useEffect(() => {
    if (!hotelData) {
      const fetchHotelData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/hotel/${id}`);
          const data = response.data;
          
          setFormData({
            hotelName: data.hotelName,
            location: data.location,
            district: data.district,
            description: data.description,
            price: data.price,
            roomType: data.roomType || "Standard",
            amenities: data.amenities || [],
            capacity: data.capacity || 1,
            images: data.images || [],
          });
          
          setImagePreviews(data.images || []);
        } catch (error) {
          toast.error("Failed to load hotel data");
          console.error("Error fetching hotel:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchHotelData();
    } else {
      setImagePreviews(hotelData.images || []);
    }
  }, [id, hotelData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hotelName.trim()) newErrors.hotelName = "Hotel name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "Valid price is required";
    if (imagePreviews.length === 0) newErrors.images = "At least one image is required";
    return newErrors;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setErrors({ ...errors, images: "Maximum 5 images allowed" });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, images: "File size exceeds 2MB" });
        return false;
      }
      return file.type.startsWith("image/");
    });

    if (validFiles.length > 0) {
      setErrors({ ...errors, images: "" });
      const previews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...previews.slice(0, 5 - imagePreviews.length)]);
      setNewImages([...newImages, ...validFiles].slice(0, 5 - formData.images.length));
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    // Check if the image is a new upload or existing URL
    if (index >= formData.images.length) {
      // It's a new image (from file upload)
      const newFiles = [...newImages];
      newFiles.splice(index - formData.images.length, 1);
      setNewImages(newFiles);
    } else {
      // It's an existing image (URL)
      const newImagesToKeep = [...formData.images];
      newImagesToKeep.splice(index, 1);
      setFormData({ ...formData, images: newImagesToKeep });
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
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

        const hotelData = {
          hotelName: formData.hotelName,
          location: formData.location,
          district: formData.district,
          description: formData.description,
          price: parseFloat(formData.price),
          roomType: formData.roomType,
          amenities: formData.amenities,
          capacity: parseInt(formData.capacity),
          images: allImageUrls,
          updatedAt: new Date().toISOString()
        };

        await axios.put(`http://localhost:5000/update-hotel/${id}`, hotelData);
        toast.success("Hotel room updated successfully!");
        navigate("/dashboard/manage-hotel");
      } catch (error) {
        toast.error("Error updating hotel room");
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
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Update Hotel Room
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hotel Name */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Hotel Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={formData.hotelName}
              onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
            />
            {errors.hotelName && <span className="text-red-500 text-sm">{errors.hotelName}</span>}
          </div>

          {/* Location & District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Location</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">District</label>
              <select
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && <span className="text-red-500 text-sm">{errors.district}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Description</label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
          </div>

          {/* Price & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Price per Night (৳)</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Guest Capacity</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
          </div>

          {/* Room Type & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Room Type</label>
              <select
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Room Images</label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${errors.images ? "border-red-300 bg-red-50" : "border-gray-300"}`}>
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-lg" 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="cursor-pointer">
                  <div className="h-32 w-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </label>
              </div>
              {errors.images && <span className="text-red-500 text-sm">{errors.images}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {updating ? (
              <>
                <FaSpinner className="animate-spin" /> Updating...
              </>
            ) : (
              <>
                <FaSave /> Update Hotel Room
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit_Hotel_Room;