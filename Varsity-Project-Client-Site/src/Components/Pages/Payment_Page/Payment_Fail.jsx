import React from "react";


const Payment_Fail = () => {
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 md:p-12">
      {/* Failure Icon */}
      <div className="text-6xl text-red-500 mb-6">
        <i className="fas fa-times-circle"></i>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed</h1>

      {/* Failure Message */}
      <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
        We encountered an issue processing your payment. Please try again or contact support if the issue persists.
      </p>

      

      {/* Informational Text */}
      <p className="text-md text-gray-600 mb-8 max-w-2xl text-center">
        If you believe this is an error, please reach out to our customer support team. We're here to assist you.
      </p>

      {/* Try Again Button */}
      <a
        href="/"
        className="bg-red-500 text-white text-lg py-3 px-6 rounded-lg hover:bg-red-600 transition duration-200"
      >
        Try Again
      </a>
    </div>
  );
};

export default Payment_Fail;