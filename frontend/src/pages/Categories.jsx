import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LibraryBig, ArrowRight, ChevronRight } from 'lucide-react';
import Footer from '../components/HomePage/Footer';
import Navbar from '../components/HomePage/Navbar';

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/ebooks/all_categories/');
                if (response.data.success) {
                    setCategories(response.data.categories);
                } else {
                    setError('Failed to fetch categories');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        navigate(`/category-ebooks?id=${categoryId}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse text-gray-500">Curating literary categories...</div>
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
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className='h-16' />
                    <div className="inline-flex items-center mb-4">
                        <LibraryBig className="h-8 w-8 text-amber-600" />
                        <span className="ml-2 text-xl font-medium tracking-widest text-gray-600">
                            LITERARY GENRES
                        </span>
                    </div>
                    <h1 className="text-4xl font-light text-gray-900">
                        Explore <span className="font-serif italic">Categories</span>
                    </h1>
                    <div className="mx-auto mt-4 h-px w-24 bg-gray-300" />
                    <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
                        Journey through our curated collection of literary genres
                    </p>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden cursor-pointer"
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <div className="relative h-96 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all">
                                {/* Category Image */}
                                <div className="relative h-3/4 overflow-hidden">
                                    <img
                                        src={`http://127.0.0.1:8000/${category.image}`}
                                        alt={category.name}
                                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-transparent" />
                                </div>

                                {/* Category Details */}
                                <div className="p-6">
                                    <h3 className="text-xl font-medium text-gray-900">{category.name}</h3>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-gray-600 text-sm">
                                            {Math.floor(Math.random() * 500 + 100)} Titles
                                        </span>
                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            className="flex items-center text-amber-600"
                                        >
                                            <span className="text-sm font-medium">Explore</span>
                                            <ChevronRight className="h-5 w-5 ml-1" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Categories;