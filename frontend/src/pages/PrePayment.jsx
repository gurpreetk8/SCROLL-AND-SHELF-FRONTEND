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
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [user, setUser] = useState(null);
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

                // Get user from token
                const userString = localStorage.getItem('user');
                const userData = JSON.parse(userString);
                setUser(userData);

                // Step 1: Create pre-booking
                const preBookResponse = await axios.post(
                    'http://127.0.0.1:8000/subscriptions/pre_book_subscription/',
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-CSRFToken': getCookie('csrftoken')
                        }
                    }
                );

                if (!preBookResponse.data.success) {
                    throw new Error(preBookResponse.data.message);
                }

                setSubscriptionId(preBookResponse.data.subscription_id);
                setLoading(false);

            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        initializePayment();
    }, [navigate]);

    const handlePayment = async () => {
        try {
            setLoading(true);
            const orderResponse = await axios.post(
                'http://127.0.0.1:8000/payments/create_order/',
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
                            'http://127.0.0.1:8000/payments/verify_order/',
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
                            navigate('/subscription-success');
                        } else {
                            throw new Error('Payment verification failed');
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
        // Cookie retrieval implementation
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