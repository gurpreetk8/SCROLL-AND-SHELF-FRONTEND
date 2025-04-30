import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Star } from 'lucide-react';
import Navbar from '../components/HomePage/Navbar';
import Footer from '../components/HomePage/Footer';

const Ebooks = () => {
    const navigate = useNavigate();
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllEbooks = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/ebooks/all_ebooks/');
                if (response.data.success) {
                    setEbooks(response.data.ebooks);
                } else {
                    setError('Failed to fetch ebooks');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllEbooks();
    }, []);

    const handleBookClick = (ebookId) => {
        navigate(`/ebook-detail?id=${ebookId}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse text-gray-500">Curating the collection...</div>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 p-8">
            Error: {error}
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className='h-16'/>
                    <h1 className="text-4xl font-light text-gray-900 mb-4">
                        Explore Our <span className="font-serif italic">Complete Collection</span>
                    </h1>
                    <div className="mx-auto h-px w-24 bg-gray-300" />
                    <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
                        Discover thousands of carefully curated titles across all genres
                    </p>
                </motion.div>

                {/* Ebooks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {ebooks.map((ebook, index) => (
                        <motion.div
                            key={ebook.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative cursor-pointer"
                            onClick={() => handleBookClick(ebook.id)}
                        >
                            <div className="relative h-96 overflow-hidden bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all">
                                {/* Book Cover */}
                                <img
                                    src={`http://127.0.0.1:8000/${ebook.cover_image}`}
                                    alt={ebook.title}
                                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

                                {/* Bestseller Badge */}
                                <div className="absolute top-4 left-4 flex items-center bg-amber-100 px-3 py-1 rounded-full">
                                    <Star className="h-4 w-4 text-amber-600" />
                                    <span className="ml-1 text-xs font-medium text-amber-900">Popular</span>
                                </div>

                                {/* Book Details */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-medium text-white">{ebook.title}</h3>
                                    <p className="text-gray-200 mt-1">{ebook.author}</p>
                                </div>
                            </div>

                            {/* Hover Action */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center bg-white/90 px-4 py-2 rounded-full">
                                    <BookOpen className="h-5 w-5 text-gray-900 mr-2" />
                                    <span className="text-gray-900 font-medium">View Details</span>
                                    <ArrowRight className="h-4 w-4 text-gray-900 ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View More */}
                {ebooks.length > 8 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-16 text-center"
                    >
                        <button className="text-gray-600 hover:text-gray-900 font-medium">
                            Load More Collections
                        </button>
                    </motion.div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Ebooks;