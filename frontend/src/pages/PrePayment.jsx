import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, X } from 'lucide-react';
import Footer from '../components/HomePage/Footer';
import Navbar from '../components/HomePage/Navbar';

const PrePayment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptionId, setSubscriptionId] = useState(null);
    const [user, setUser] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info'); // 'info' or 'success'
    const amount = 199;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login-register');
                    return;
                }

                const userString = localStorage.getItem('user');
                const userData = JSON.parse(userString);
                setUser(userData);

                const subscriptionResponse = await axios.post(
                    'https://scrollandshelf.pythonanywhere.com/subscriptions/create_subscription/',
                    {
                        duration_days: 30,
                        amount_paid: amount
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!subscriptionResponse.data.success) {
                    if (subscriptionResponse.data.message === "Active subscription already exists") {
                        setToastMessage("You already have an active subscription. Redirecting to homepage...");
                        setToastType('info');
                        setShowToast(true);
                        setLoading(false);
                        return;
                    }
                    throw new Error(subscriptionResponse.data.message);
                }

                setSubscriptionId(subscriptionResponse.data.subscription_id);
                setLoading(false);

            } catch (err) {
                const errorMessage = err.response?.data?.message ||
                    err.message ||
                    "Failed to initialize subscription";
                console.error("Subscription Error:", {
                    message: errorMessage,
                    response: err.response?.data
                });
                setError(errorMessage);
                setLoading(false);
            }
        };

        initializePayment();
    }, [navigate]);

    // Delayed redirect after toast shows
    useEffect(() => {
        if (showToast) {
            const redirectPath = toastType === 'success' ? '/subscription-success' : '/';
            const timer = setTimeout(() => navigate(redirectPath), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast, navigate, toastType]);

    const handlePayment = async () => {
        try {
            setLoading(true);
            const orderResponse = await axios.post(
                'https://scrollandshelf.pythonanywhere.com/payments/create_order/',
                {
                    subscription_id: subscriptionId,
                    amount: amount,
                    currency: 'INR'
                },
                {
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                }
            );

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message);
            }

            const options = {
                key: 'rzp_test_ew74Ktx27rLLPC',
                amount: orderResponse.data.amount,
                currency: orderResponse.data.currency,
                name: 'Scroll&Shelf',
                description: 'Premium Subscription',
                order_id: orderResponse.data.order_id,
                handler: async (response) => {
                    try {
                        const verificationResponse = await axios.post(
                            'https://scrollandshelf.pythonanywhere.com/payments/verify_order/',
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            },
                            {
                                headers: {
                                    'X-CSRFToken': getCookie('csrftoken')
                                }
                            }
                        );

                        if (verificationResponse.data.success) {
                            setToastMessage("Payment successful! Redirecting...");
                            setToastType('success');
                            setShowToast(true);
                        } else {
                            throw new Error(verificationResponse.data.message || 'Payment verification failed');
                        }
                    } catch (err) {
                        setError(err.message);
                        setLoading(false);
                    }
                },
                theme: {
                    color: '#F59E0B'
                }
            };

            const razorpay = new Razorpay(options);
            razorpay.open();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <Loader2 className="h-12 w-12 text-amber-600" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md p-6 bg-red-50 rounded-xl">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-red-900 mb-2">Payment Error</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center text-amber-600 hover:text-amber-700"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Return to Subscription
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            {/* Toast notification - positioned top-right */}
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-4 right-4 z-50"
                >
                    <div className={`bg-white p-4 rounded-lg shadow-lg border ${
                        toastType === 'success' ? 'border-green-200' : 'border-amber-200'
                    } max-w-xs`}>
                        <div className="flex items-start">
                            {toastType === 'success' ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                            )}
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{toastMessage}</p>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div 
                                        className={`h-1 rounded-full ${
                                            toastType === 'success' ? 'bg-green-500' : 'bg-amber-500'
                                        }`} 
                                        style={{ animation: 'progressBar 5s linear forwards' }}
                                    ></div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowToast(false)} 
                                className="ml-2 text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="min-h-screen bg-white flex items-center justify-center py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-lg w-full p-8 bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-xl border border-amber-100"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-light text-gray-900 mb-2">
                            Confirm Your Subscription
                        </h1>
                        <div className="mx-auto h-px w-16 bg-gradient-to-r from-amber-400 to-amber-600" />
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-amber-100">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-amber-100">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium text-gray-900">{user?.email}</span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-amber-100">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="text-2xl font-light text-amber-600">₹{amount}</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
                    >
                        <CheckCircle className="h-6 w-6" />
                        <span className="text-lg font-medium">Proceed with Payment</span>
                    </motion.button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Secure payment processing by Razorpay
                    </p>
                </motion.div>
            </div>
            <Footer />

            <style jsx>{`
                @keyframes progressBar {
                    0% { width: 100%; }
                    100% { width: 0%; }
                }
            `}</style>
        </>
    );
};

export default PrePayment;