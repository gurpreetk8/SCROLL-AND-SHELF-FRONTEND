import { motion } from "framer-motion";
import { Crown, BookOpen, CheckCircle, ArrowRight, Library, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/HomePage/Navbar";
import Footer from "../components/HomePage/Footer";

const SubscriptionOverview = () => {
    const navigate = useNavigate();
    const features = [
        "Unlimited access to 1M+ ebooks",
        "Priority customer support",
        "Exclusive member-only content",
        "DRM-free downloads",
        "Personalized recommendations",
        "Advanced search filters"
    ];

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-white flex items-center justify-center py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center mb-4 bg-amber-100 px-6 py-2 rounded-full">
                            <Crown className="h-6 w-6 text-amber-600 mr-2" />
                            <span className="text-sm font-medium text-amber-900">PREMIUM MEMBERSHIP</span>
                        </div>
                        <h1 className="text-4xl font-light text-gray-900 mb-4">
                            Unlimited <span className="font-serif italic">Literary</span> Access
                        </h1>
                        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-amber-400 to-amber-600" />
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative bg-gradient-to-br from-white to-amber-50 border border-amber-100 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')] opacity-10" />

                        <div className="relative z-10 p-16">
                            <div className="text-center mb-12">
                                <div className="flex items-center justify-center mb-6">
                                    <Zap className="h-8 w-8 text-amber-600 mr-2" />
                                    <span className="text-5xl font-light text-gray-900">
                                        Rs199<span className="text-2xl text-gray-600">/month</span>
                                    </span>
                                </div>
                                <p className="text-gray-600 max-w-xl mx-auto">
                                    Full access to our premium library with new titles added daily. Cancel anytime.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 mb-16">
                                <div className="space-y-2">
                                    {features.slice(0, 3).map((feature, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                                            <p className="text-gray-900 font-light">{feature}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {features.slice(3).map((feature, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                                            <p className="text-gray-900 font-light">{feature}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/pre-payment")}
                                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all"
                            >
                                <BookOpen className="h-6 w-6" />
                                <span className="text-lg font-medium">Start Reading Now</span>
                                <ArrowRight className="h-6 w-6 ml-2" />
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 text-center text-gray-600 text-sm"
                    >
                        <p>7-day free trial available • Secure payment processing</p>
                        <p className="mt-2">Cancel anytime • No hidden fees</p>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SubscriptionOverview;