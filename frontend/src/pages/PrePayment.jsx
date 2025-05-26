import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Footer from '../components/HomePage/Footer';
import Navbar from '../components/HomePage/Navbar';

const PrePayment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptionId, setSubscriptionId] = useState(null);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
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
                    navigate('/login');
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
                        setModalMessage("You already have an active subscription. Redirecting to homepage...");
                        setShowModal(true);
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

    // Delayed redirect after modal shows
    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => navigate('/'), 3000);
            return () => clearTimeout(timer);
        }
    }, [showModal, navigate]);

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
                name: 'Scroll & Shelf',
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
                            alert('Payment successful! Redirecting to homepage...');
                            setTimeout(() => navigate('/'), 3000);
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

            {/* Modal for existing subscription */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md"
                    >
                        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Subscription Info</h2>
                        <p className="text-gray-600">{modalMessage}</p>
                    </motion.div>
                </div>
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
        </>
    );
};

export default PrePayment;