import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { FiCar, FiSettings, FiCalendar, FiDollarSign, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const Create_Vehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    vehicleName: '',
    brand: '',
    model: '',
    vehicleType: 'sedan',
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: 4,
    pricePerDay: '',
    pricePerHour: '',
    features: [],
    images: [],
    availableFrom: '',
    availableTo: '',
    location: '',
    registrationNumber: ''
  });

  const vehicleTypes = ['Sedan', 'SUV', 'Microbus', 'Premium', 'Bike'];
  const featuresList = ['AC', 'GPS', 'Bluetooth', 'Camera', 'Sunroof'];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024
    );

    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews.slice(0, 5 - imagePreviews.length)]);

    setFormData({
      ...formData,
      images: [...formData.images, ...validFiles].slice(0, 5)
    });
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature) 
        ? prev.features.filter(f => f !== feature) 
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Image upload logic here
      const response = await axios.post('/api/vehicles', formData);
      
      if(response.data.success) {
        toast.success('Vehicle added successfully!');
        navigate('/manage-vehicles');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          {/* <FiCar className="text-blue-600 w-10 h-10" /> */}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Vehicle
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vehicle Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
              {/* <FiCar className="text-blue-500" /> */}
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-100 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                  value={formData.vehicleName}
                  onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  className="w-full p-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number *
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-100 p-3 border-2 border-gray-200 rounded-xl"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl p-3">
                  {/* <FiMapPin className="text-gray-400 mr-2" /> */}
                  <input
                    type="text"
                    className="w-full bg-white outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
              {/* <FiSettings className="text-blue-500" /> */}
              Technical Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                <select
                  className="w-full p-3 bg-gray-100 border-2 border-gray-200 rounded-xl"
                  value={formData.transmission}
                  onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <select
                  className="w-full bg-gray-100 p-3 border-2 border-gray-200 rounded-xl"
                  value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-gray-100 p-3 border-2 border-gray-200 rounded-xl"
                  value={formData.seats}
                  onChange={(e) => setFormData({...formData, seats: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Features & Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                {/* <FiCheckCircle className="text-blue-500" /> */}
                Features & Amenities
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {featuresList.map(feature => (
                  <label 
                    key={feature}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      formData.features.includes(feature) 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden bg-gray-100"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    <span className={`w-5 h-5 inline-block mr-3 rounded-sm border-2 ${
                      formData.features.includes(feature) 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-white border-gray-300'
                    }`} />
                    {feature}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                {/* <FiCalendar className="text-blue-500" /> */}
                Availability & Images
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available From
                    </label>
                    <input
                      type="date"
                      className="w-full bg-gray-100 p-3 border-2 border-gray-200 rounded-xl"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available To
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border-2 bg-gray-100 border-gray-200 rounded-xl"
                      value={formData.availableTo}
                      onChange={(e) => setFormData({...formData, availableTo: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Images (Max 5)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <div className="flex flex-wrap gap-4 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative w-20 h-20">
                          <img
                            src={preview}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="cursor-pointer inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                      Choose Files
                      <input
                        type="file"
                        className="hidden bg-gray-100"
                        multiple
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
              {/* <FiDollarSign className="text-blue-500" /> */}
              Pricing Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Rate (৳) *
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl p-3">
                  {/* <FiDollarSign className="text-gray-400 mr-2" /> */}
                  <input
                    type="number"
                    className="w-full bg-white outline-none"
                    required
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (৳)
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl p-3">
                  {/* <FiDollarSign className="text-gray-400 mr-2" /> */}
                  <input
                    type="number"
                    className="w-full bg-white outline-none"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Add Vehicle Now'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create_Vehicle;