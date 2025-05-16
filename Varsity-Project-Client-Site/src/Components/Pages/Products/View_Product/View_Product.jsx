import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart, FaArrowLeft, FaMoneyBillWave } from "react-icons/fa";

const View_Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        fetch(`https://varsity-project-server-site.vercel.app/product/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch product:", err);
                setLoading(false);
            });
    }, [id]);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar
                key={i}
                className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            />
        ));
    };

    const handleQuantityChange = (value) => {
        const newQuantity = quantity + value;
        if (newQuantity > 0 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        const cartItem = {
            productId: product._id,
            productName: product.productName,
            price: product.price,
            quantity: quantity,
            image: product.image,
        };
        console.log("Added to cart:", cartItem);
        setIsCartModalOpen(true);
    };

    const handlePurchaseNow = () => {
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSubmit = () => {
        const paymentData = {
            productId: product._id,
            productName: product.productName,
            price: product.price,
            quantity: quantity,
            totalAmount: (quantity * parseFloat(product.price)).toFixed(2),
        };

        console.log("Payment Submitted:", paymentData);

        // This would be your actual payment endpoint
        fetch("https://varsity-project-server-site.vercel.app/product-payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.url) {
                    window.location.href = result.url; // Redirect to payment gateway
                } else {
                    console.error("Payment URL not received:", result);
                    alert("Payment initialization failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Payment error:", error);
                alert("An error occurred during payment processing.");
            });
    };

    if (loading) return <div className="text-center text-gray-500 py-10">Loading...</div>;
    if (!product) return <div className="text-center text-red-500 py-10">Product not found.</div>;

    return (
        <div className="py-12 px-6 sm:px-8 bg-gray-50">
    <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-indigo-600 mb-6 transition-colors duration-300"
    >
        <FaArrowLeft className="mr-2" />
        Back to Products
    </button>

    <div className="max-w-screen-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Image */}
            <div className="bg-gray-50 p-8 rounded-lg flex items-center justify-center border border-gray-200">
                <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-80 object-contain transition-transform duration-500 hover:scale-105"
                />
            </div>

            {/* Right: Info */}
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{product.productName}</h1>
                    {/* <div className="mt-2 flex items-center">
                        {renderStars(product.rating || 4)}
                        <span className="ml-2 text-gray-500 text-sm">({product.reviews || 0} reviews)</span>
                        {product.bestseller && (
                            <span className="ml-3 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                Bestseller
                            </span>
                        )}
                    </div> */}
                </div>

                <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-2xl font-bold text-indigo-700">
                                ${parseFloat(product.price).toFixed(2)}
                            </span>
                            {product.originalPrice && (
                                <>
                                    <span className="ml-2 text-gray-500 line-through">
                                        ${parseFloat(product.originalPrice).toFixed(2)}
                                    </span>
                                    <span className="ml-2 px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                                        {Math.round((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                        {/* <div className="text-sm">
                            {product.stock > 0 ? (
                                <span className="text-green-600 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    In Stock ({product.stock})
                                </span>
                            ) : (
                                <span className="text-red-600 flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    Out of Stock
                                </span>
                            )}
                        </div> */}
                    </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{product.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider">SKU</div>
                        <div className="font-medium text-gray-900">{product.sku || 'N/A'}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider">Category</div>
                        <div className="font-medium text-gray-900">{product.category || 'N/A'}</div>
                    </div>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                            onClick={() => handleQuantityChange(-1)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            -
                        </button>
                        <input 
                            type="number" 
                            className="w-12 text-center border-0 bg-transparent text-gray-900" 
                            value={quantity}
                            readOnly
                        />
                        <button 
                            onClick={() => handleQuantityChange(1)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            +
                        </button>
                    </div>
                    
                </div>

                <button
                    onClick={handlePurchaseNow}
                    disabled={product.stock <= 0}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300 ${product.stock > 0 ? 'bg-blue-900 text-white hover:bg-black shadow-md hover:shadow-lg' : 'bg-blue-900 text-white cursor-not-allowed'}`}
                >
                    <FaMoneyBillWave className="mr-2" />
                    Purchase Now
                </button>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Free shipping
                        </div>
                        
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Secure checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Cart Success Modal */}
    {isCartModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border border-gray-100 transform transition-all duration-300 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Added to Cart</h2>
                    <button 
                        onClick={() => setIsCartModalOpen(false)} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-4">
                        <img 
                            src={product.image} 
                            alt={product.productName} 
                            className="w-16 h-16 object-contain border border-gray-200 rounded-lg"
                        />
                        <div>
                            <h3 className="font-medium text-gray-900">{product.productName}</h3>
                            <p className="text-sm text-gray-500">Qty: {quantity}</p>
                        </div>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                        <span className="font-medium text-gray-700">Subtotal:</span>
                        <span className="font-bold text-gray-900">${(quantity * parseFloat(product.price)).toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={() => setIsCartModalOpen(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        View Cart ({cartItemsCount + quantity})
                    </button>
                </div>
            </div>
        </div>
    )}

    {/* Payment Modal */}
    {isPaymentModalOpen && (
        <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl border border-gray-100 transform transition-all duration-300 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Confirm Purchase</h2>
                    <button 
                        onClick={() => setIsPaymentModalOpen(false)} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Product</p>
                            <p className="font-medium">{product.productName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Quantity</p>
                            <p className="font-medium">{quantity}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Unit Price</p>
                            <p className="font-medium">${parseFloat(product.price).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-bold text-lg">${(quantity * parseFloat(product.price)).toFixed(2)}</p>
                        </div>
                    </div>

                    {product.originalPrice && (
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                            <p className="text-green-700 text-sm">
                                <span className="font-medium">You save:</span> ${(quantity * (parseFloat(product.originalPrice) - parseFloat(product.price))).toFixed(2)} 
                                <span className="ml-2">({Math.round((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice) * 100)}% off)</span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={() => setIsPaymentModalOpen(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePaymentSubmit}
                        className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors flex items-center justify-center"
                    >
                        <FaMoneyBillWave className="mr-2" />
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    )}
</div>
    );
};

export default View_Product;