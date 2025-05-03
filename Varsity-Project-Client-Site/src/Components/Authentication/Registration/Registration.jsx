import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiGlobe, FiCamera, FiLock } from "react-icons/fi";

const Registration = () => {
  const { signUpUser, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize all error fields including 'general'
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    nationality: "",
    image: "",
    password: "",
    confirmPassword: "",
    general: ""
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation function remains the same
  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number (10-11 digits)";
    }

    if (!formData.nationality) newErrors.nationality = "Nationality is required";

    if (!formData.image) {
      newErrors.image = "Profile image is required";
    } else if (formData.image && !formData.image.type.startsWith("image/")) {
      newErrors.image = "File must be an image";
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|;:'",.<>?/~`]).{6,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be 6+ chars with letter, number, and special char";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    userData.image = e.target.image.files[0];

    const validationErrors = validateForm(userData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        
        // Upload image to ImgBB
        const imageFormData = new FormData();
        imageFormData.append('image', userData.image);
        const imageResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_APIKEY}`,
          imageFormData
        );

        // Create user data with image URL
        const userDataWithImage = {
          ...userData,
          image: imageResponse.data.data.display_url,
          profileId: `GF${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          role: "user",
          aproval: "approval",
          createDate: new Date().toLocaleDateString(),
          createTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        };

        // Submit to backend
        const response = await axios.post('https://varsity-project-server-site.vercel.app/registration', userDataWithImage);
        
        if (response.data.success) {
          const result = await signUpUser(userData.email, userData.password);
          setUser(result.user);
          toast.success("Registration successful!");
          navigate("/");
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, general: error.message }));
        toast.success("Registration successful!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "File size exceeds 2MB" }));
      } else if (!file.type.startsWith("image/")) {
        setErrors(prev => ({ ...prev, image: "Only image files allowed" }));
      } else {
        setErrors(prev => ({ ...prev, image: "" }));
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side */}
          <div className="hidden md:block bg-gradient-to-br from-indigo-600 to-violet-500 p-8">
            <div className="h-full flex flex-col justify-center items-center text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Welcome Aboard</h2>
              <p className="text-lg opacity-90">Join our community and start your journey with us</p>
              <div className="mt-8 w-64 h-64 bg-white/10 rounded-full flex items-center justify-center">
                <FiUser className="w-32 h-32 opacity-75" />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-8 md:p-12 bg-black">
            <h2 className="text-3xl font-bold text-slate-800 mb-8  text-center">
              Create Account
            </h2>

            {errors.general && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Form Fields */}
                {['fullName', 'email', 'phoneNumber', 'nationality'].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 flex items-center">
                      {{
                        fullName: <FiUser className="mr-2" />,
                        email: <FiMail className="mr-2" />,
                        phoneNumber: <FiPhone className="mr-2" />,
                        nationality: <FiGlobe className="mr-2" />
                      }[field]}
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="relative">
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors[field] ? "border-red-400" : "border-slate-300"
                        } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                      />
                      {errors[field] && (
                        <span className="absolute right-3 top-3.5 text-red-500">!</span>
                      )}
                    </div>
                    {errors[field] && (
                      <p className="text-xs text-red-500">{errors[field]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center">
                  <FiCamera className="mr-2" /> Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-full cursor-pointer hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-400">
                        <FiCamera className="w-6 h-6" />
                      </div>
                    )}
                  </label>
                  {errors.image && (
                    <p className="text-xs text-red-500">{errors.image}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                {['password', 'confirmPassword'].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 flex items-center">
                      <FiLock className="mr-2" />
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name={field}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors[field] ? "border-red-400" : "border-slate-300"
                        } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                      />
                      {errors[field] && (
                        <span className="absolute right-3 top-3.5 text-red-500">!</span>
                      )}
                    </div>
                    {errors[field] && (
                      <p className="text-xs text-red-500">{errors[field]}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-500 text-white py-3.5 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-violet-600 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-80"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;