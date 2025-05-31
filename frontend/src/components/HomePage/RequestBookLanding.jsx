import React from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestBookLanding = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background elements remain unchanged */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header section remains unchanged */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-light text-gray-900">
            Request a <span className="font-serif italic">Book</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Looking for a specific book or genre? Let us know and we'll do our best to bring it to you.
          </p>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </motion.div>

        {/* Main card container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-amber-50 p-10 sm:p-16 text-center">
            <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
              <Book className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Requests</h3>
            <p className="text-gray-600 max-w-xs mb-8">
              Tell us what you're looking for and we'll try our best to add it.
            </p>

            {/* SIMPLIFIED BUTTON SOLUTION THAT WILL WORK */}
            <Link 
              to="/request-book" 
              className="inline-block"
              onClick={() => console.log('Link clicked!')} // Important for proper sizing
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
              >
                <span>Continue to Request Form</span>
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RequestBookLanding;