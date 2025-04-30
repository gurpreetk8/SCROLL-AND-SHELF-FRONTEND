import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BookOpen, Download, ArrowLeft, Bookmark, Share2, Star } from 'lucide-react';
import Footer from '../components/HomePage/Footer';
import Navbar from '../components/HomePage/Navbar';

const EbookDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [ebook, setEbook] = useState(null);
    const [latestEbooks, setLatestEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extract ebook ID from query params
    const queryParams = new URLSearchParams(location.search);
    const ebookId = queryParams.get('id');

    useEffect(() => {
        const fetchEbookDetails = async () => {
            try {
                const formData = new FormData();
                formData.append('id', ebookId);

                const response = await axios.post(
                    'http://127.0.0.1:8000/ebooks/ebook_detail/',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                if (response.data.success) {
                    setEbook(response.data.ebook);
                    // Fetch latest ebooks
                    const latestRes = await axios.post(
                        'http://127.0.0.1:8000/ebooks/latest_ebooks/',
                        null,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }
                    );
                    setLatestEbooks(latestRes.data.ebooks);
                } else {
                    setError('Failed to fetch ebook details');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEbookDetails();
    }, [ebookId]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse text-gray-500">Loading book details...</div>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 p-8">
            Error: {error}  
        </div>
    );

    if (!ebook) return null;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Book Header */}
            <motion.header
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-b from-gray-50 to-white"
            >
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Collection
                    </button>

                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Book Cover */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="relative group"
                        >
                            <div className="relative h-[600px] w-full bg-gray-100 rounded-2xl shadow-xl overflow-hidden">
                                <img
                                    src={`http://127.0.0.1:8000/${ebook.cover_image}`}
                                    alt={ebook.title}
                                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </motion.div>

                        {/* Book Details */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex flex-col justify-center"
                        >
                            <div className="mb-6">
                                <h1 className="text-4xl font-serif italic text-gray-900 mb-4">
                                    {ebook.title}
                                </h1>
                                <p className="text-2xl font-light text-gray-600">by {ebook.author}</p>
                            </div>

                            <div className="flex items-center space-x-4 mb-8">
                                <div className="flex items-center text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-current" />
                                    ))}
                                </div>
                                <span className="text-gray-600">(4.8/5 from 1.2k reviews)</span>
                            </div>

                            <p className="text-lg font-light text-gray-600 leading-relaxed mb-8">
                                {ebook.description}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-4">
                                {ebook.file_url ? (
                                    <motion.a
                                        whileHover={{ scale: 1.05 }}
                                        href={`http://127.0.0.1:8000/${ebook.file_url}`}
                                        className="flex items-center bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800"
                                    >
                                        <Download className="h-5 w-5 mr-2" />
                                        Download Now
                                    </motion.a>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-lg hover:from-amber-600 hover:to-amber-700"
                                        onClick={() => navigate('/subscribe')}
                                    >
                                        <BookOpen className="h-5 w-5 mr-2" />
                                        Subscribe to Access
                                    </motion.button>
                                )}
                                <button className="p-3 rounded-full border border-gray-200 hover:border-gray-300">
                                    <Bookmark className="h-5 w-5 text-gray-600" />
                                </button>
                                <button className="p-3 rounded-full border border-gray-200 hover:border-gray-300">
                                    <Share2 className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            {/* Sample Images Gallery */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-medium text-gray-900 mb-8">Preview Pages</h2>
                    <div className="flex overflow-x-auto pb-6 space-x-4 scrollbar-hide">
                        {ebook.sample_images.map((image, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                className="flex-shrink-0 relative w-64 h-96 bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
                            >
                                <img
                                    src={`http://127.0.0.1:8000/${image}`}
                                    alt={`Sample ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Ebooks */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-medium text-gray-900 mb-8">Latest Additions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {latestEbooks.map((ebook) => (
                            <motion.div
                                key={ebook.id}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                                onClick={() => navigate(`/ebook-detail?id=${ebook.id}`)}
                            >
                                <div className="relative h-64 bg-gray-100 rounded-t-xl overflow-hidden">
                                    <img
                                        src={`http://127.0.0.1:8000/${ebook.cover_image}`}
                                        alt={ebook.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900">{ebook.title}</h3>
                                    <p className="text-gray-600 mt-2">{ebook.author}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default EbookDetail;