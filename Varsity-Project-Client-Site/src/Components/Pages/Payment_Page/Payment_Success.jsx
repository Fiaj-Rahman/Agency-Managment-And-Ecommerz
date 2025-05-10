import React from "react";
import { useParams } from "react-router-dom";

const Payment_Success = () => {
  const { tranId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4 py-6 md:px-16 md:py-12">
      {/* Success Icon */}
      <div className="text-6xl text-green-500 mb-6">
        <i className="fas fa-check-circle"></i>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful</h1>

      {/* Success Message */}
      <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
        Thank you for your payment! Your transaction has been successfully completed.
      </p>

      {/* Transaction ID */}
      <p className="text-md text-gray-800 mb-6">
        <strong>Transaction ID:</strong> {tranId}
      </p>

      {/* Informational Text */}
      <p className="text-md text-gray-600 mb-8 max-w-2xl text-center">
        We appreciate your trust in our services. You can now proceed with your appointment, or feel free to contact us if you need any further assistance.
      </p>

      {/* Return to Homepage Button */}
      <a
        href="/"
        className="bg-green-500 text-white text-lg py-3 px-6 rounded-lg hover:bg-green-600 transition duration-200"
      >
        Return to Homepage
      </a>
    </div>
  );
};

export default Payment_Success;