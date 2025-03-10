import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider"; // Ensure the path is correct
import axios from "axios";

const Login = () => {
  const { loginUser, user, resetPass } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal
  const [resetEmail, setResetEmail] = useState(""); // State to handle email input in the modal
  const [resetErrors, setResetErrors] = useState(""); // Error message for password reset

  const redirectPath = location.state?.from || "/"; // Redirect to previous page or home if not available

  // Validate form data (Email validation function)
  const validateForm = (formData) => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  // Validate reset email (for password reset modal)
  const validateResetEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // Handle form submission (Login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const formData = { email, password };
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        await loginUser(email, password);

        const { data } = await axios.post(
          'http://localhost:5000/jwt',
          { email },{withCredentials: true}
          
        );

        setLoading(false);
        navigate('/statistic'); // Redirect after successful login
        return data;
      } catch (error) {
        setLoading(false);
        setErrors({
          email: "",
          password: "",
          general:"Something went wrong. Please try again.",
        });
      }
    }
  };

  // Handle input change (clear individual field error)
  const handleInputChange = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Handle password reset form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail || !validateResetEmail(resetEmail)) {
      setResetErrors("Please enter a valid email.");
      return;
    }
    try {
      await resetPass(resetEmail);
      setResetErrors(""); // Clear errors after successful submission
      setShowModal(false); // Close modal on success
    } catch (error) {
      setResetErrors(error.message || "An error occurred. Please try again.");
    }
  };

  // Redirect to the previous page if the user is already logged in
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/statistic");
    } else {
      setIsLoading(false);
    }
  }, [user, navigate, redirectPath]);

  if (isLoading) {
    return <div>Loading...</div>; // Optionally, a loading spinner or message
  }

  return (
    // bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen

<div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">

    <div>
         {/* Welcome Text About Samadhan Group */}
<p className="mb-8 pt-10 text-center text-white text-lg font-medium leading-relaxed md:text-2xl">
  Welcome to <span className="text-indigo-200 font-bold">Green Fashion!</span><br />
  We are dedicated to providing innovative solutions to your business needs.<br />
  Log in to access our services and features.
</p>

    </div>


    <div className="flex flex-col md:flex-row ">
        
        {/* Image SVG */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-8">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/login-page-illustration-download-in-svg-png-gif-file-formats--app-developing-development-secure-mobile-webapp-and-pack-design-illustrations-3783954.png"
            alt="Login Illustration"
            className="max-w-full h-auto"
          />
        </div>
  
        {/* Login form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-8">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg text-gray-800">
            <h1 className="text-3xl font-semibold text-center text-gray-900">Login</h1>
  
            {/* Display general error message */}
            {errors.general && (
              <div className="mb-4 text-red-400 text-center font-medium">{errors.general}</div>
            )}
  
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-md border-2 ${errors.email ? "border-red-400" : "border-gray-300"} bg-gray-50 text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200`}
                />
                {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
              </div>
  
              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-md border-2 ${errors.password ? "border-red-400" : "border-gray-300"} bg-gray-50 text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200`}
                />
                {errors.password && <span className="text-xs text-red-400">{errors.password}</span>}
                <div className="flex justify-end text-xs text-gray-400">
                  <button className="text-blue-800 font-bold" type="button" onClick={() => setShowModal(true)}>
                    Forgot Password?
                  </button>
                </div>
              </div>
  
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 text-white bg-indigo-600 rounded-sm text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={loading}
              >
                {loading ? (
                  "Log in..."
                ) : (
                  "Log in"
                )}
              </button>
            </form>
  
            
  
            <p className="text-xs text-center sm:px-6 text-gray-400">
              Don't have an account?{" "}
              <Link className="underline text-indigo-600 font-bold" to="/signUp">
                Registration
              </Link>
            </p>
          </div>
        </div>
  
        {/* Modal for Forgot Password */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
              <form onSubmit={handleResetPassword}>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border-2 rounded-md border-gray-300"
                  />
                  {resetErrors && <span className="text-xs text-red-400">{resetErrors}</span>}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Email"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

</div>

    

  );
};

export default Login;