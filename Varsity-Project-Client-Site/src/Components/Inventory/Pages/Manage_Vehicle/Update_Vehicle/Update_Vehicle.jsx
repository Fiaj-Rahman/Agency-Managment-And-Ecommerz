import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSave, FaSpinner } from "react-icons/fa";

const Update_Vehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get vehicle data from location state
  const vehicleData = location.state?.vehicleData;
  
  const [loading, setLoading] = useState(!vehicleData);
  const [updating, setUpdating] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [formData, setFormData] = useState({
    vehicleName: vehicleData?.vehicleName || "",
    type: vehicleData?.vehicleType || "Car",
    brand: vehicleData?.brand || "",
    model: vehicleData?.model || "",
    price: vehicleData?.pricePerHour || "",
    seatingCapacity: vehicleData?.seats || 2,
    transmission: vehicleData?.transmission || "Automatic",
    fuelType: vehicleData?.fuelType || "Petrol",
    location: vehicleData?.location || "",
    district: vehicleData?.district || "",
    description: vehicleData?.description || "",
    amenities: vehicleData?.features || [],
    images: vehicleData?.images || [],
  });

  const [errors, setErrors] = useState({
    vehicleName: "",
    type: "",
    brand: "",
    model: "",
    price: "",
    seatingCapacity: "",
    location: "",
    district: "",
    description: "",
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

  const vehicleTypes = ["Car", "Bike", "SUV", "Truck", "Van"];
  const transmissionTypes = ["Automatic", "Manual"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const amenitiesList = [
    "AC",
    "GPS Navigation",
    "Bluetooth",
    "Sunroof",
    "USB Port",
    "Leather Seats",
    "Child Seat",
    "Keyless Entry",
  ];

  useEffect(() => {
    if (!vehicleData) {
      const fetchVehicleData = async () => {
        try {
          const response = await axios.get(`https://varsity-project-server-site.vercel.app/vehicles/${id}`);
          const data = response.data;
          setFormData({
            vehicleName: data.vehicleName,
            type: data.vehicleType || "Car",
            brand: data.brand,
            model: data.model,
            price: data.pricePerHour,
            seatingCapacity: data.seats,
            transmission: data.transmission || "Automatic",
            fuelType: data.fuelType || "Petrol",
            location: data.location,
            district: data.district,
            description: data.description,
            amenities: data.features || [],
            images: data.images || [],
          });
          setImagePreviews(data.images || []);
        } catch (error) {
          toast.error("Failed to load vehicle data");
          console.error("Error fetching vehicle:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchVehicleData();
    } else {
      setImagePreviews(vehicleData.images || []);
    }
  }, [id, vehicleData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleName.trim()) newErrors.vehicleName = "Vehicle name is required";
    if (!formData.type) newErrors.type = "Vehicle type is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "Valid price is required";
    if (!formData.seatingCapacity || formData.seatingCapacity < 1)
      newErrors.seatingCapacity = "Valid seating capacity is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (imagePreviews.length === 0) newErrors.images = "At least one image is required";
    return newErrors;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    if (index >= formData.images.length) {
      const newFiles = [...newImages];
      newFiles.splice(index - formData.images.length, 1);
      setNewImages(newFiles);
    } else {
      const newImagesToKeep = [...formData.images];
      newImagesToKeep.splice(index, 1);
      setFormData({ ...formData, images: newImagesToKeep });
    }
  };

  const handleAmenityChange = (amenity) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter((item) => item !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: newAmenities });
  };

  const uploadImages = async (images) => {
    const uploadPromises = images.map(async (image) => {
      if (typeof image === 'string') return image;
      
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

        let allImageUrls = [...formData.images];
        if (newImages.length > 0) {
          const uploadedUrls = await uploadImages(newImages);
          allImageUrls = [...allImageUrls, ...uploadedUrls];
        }

        const vehicleData = {
          vehicleName: formData.vehicleName,
          vehicleType: formData.type,
          brand: formData.brand,
          model: formData.model,
          pricePerHour: parseFloat(formData.price),
          pricePerDay: parseFloat(formData.price) * 8,
          seats: parseInt(formData.seatingCapacity),
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          location: formData.location,
          district: formData.district,
          description: formData.description,
          features: formData.amenities,
          images: allImageUrls,
        };

        await axios.put(`https://varsity-project-server-site.vercel.app/update-vehicles/${id}`, vehicleData);
        toast.success("Vehicle updated successfully!");
        navigate("/dashboard/manage-vehicle");
      } catch (error) {
        toast.error("Error updating vehicle");
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
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Update Vehicle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Name */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Vehicle Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
              value={formData.vehicleName}
              onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
            />
            {errors.vehicleName && <span className="text-red-500 text-sm">{errors.vehicleName}</span>}
          </div>

          {/* Vehicle Type & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Vehicle Type</label>
              <select
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <span className="text-red-500 text-sm">{errors.type}</span>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Brand</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
              {errors.brand && <span className="text-red-500 text-sm">{errors.brand}</span>}
            </div>
          </div>

          {/* Model & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Model</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
              {errors.model && <span className="text-red-500 text-sm">{errors.model}</span>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Price per Hour (৳)</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
            </div>
          </div>

          {/* Seating Capacity & Transmission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Seating Capacity</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.seatingCapacity}
                onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
              />
              {errors.seatingCapacity && <span className="text-red-500 text-sm">{errors.seatingCapacity}</span>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Transmission</label>
              <div className="flex space-x-4">
                {transmissionTypes.map(transmission => (
                  <label key={transmission} className="flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      value={transmission}
                      checked={formData.transmission === transmission}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    />
                    <span className="ml-2">{transmission}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Fuel Type & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Fuel Type</label>
              <select
                className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              >
                {fuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

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
          </div>

          {/* District & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Vehicle Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-lg border bg-gray-300 border-gray-300"
            />
            {errors.images && <span className="text-red-500 text-sm">{errors.images}</span>}

            <div className="flex flex-wrap gap-4 mt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="h-20 w-20 rounded object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
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
                <FaSave /> Update Vehicle
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update_Vehicle;