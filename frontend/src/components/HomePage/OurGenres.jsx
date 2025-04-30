import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const OurGenres = () => {
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
    navigate(`/ebook-category?id=${categoryId}`);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <ChevronRight className="text-gray-900 h-6 w-6" />,
    prevArrow: <ChevronLeft className="text-gray-900 h-6 w-6" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-gray-500">Loading genres...</div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-8">
      Error: {error}
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-light text-gray-900">
            Explore <span className="font-serif italic">Our Genres</span>
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gray-300" />
        </motion.div>

        {/* Category Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Slider {...sliderSettings} className="category-slider">
            {categories.map((category) => (
              <div key={category.id} className="px-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative h-72 cursor-pointer overflow-hidden"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {/* Category Image */}
                  <div className="absolute inset-0 bg-gray-100">
                    <img
                      src={`http://127.0.0.1:8000/${category.image}`}
                      alt={category.name}
                      className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                  </div>

                  {/* Category Name */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                    <h3 className="text-2xl font-medium text-white">
                      {category.name}
                    </h3>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center text-sm font-medium text-white"
                    >
                      <span>Explore Category</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </motion.div>

        {/* View All Button */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button
            className="inline-flex items-center border border-gray-900 bg-white px-8 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/categories')}
          >
            View All Genres
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default OurGenres;