import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import CreatePost from './CreatePost'; // adjust path as needed

const CommunityHero = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="h-16" />
        <div className="inline-flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-amber-600" />
          <span className="ml-2 text-xl font-medium tracking-widest text-gray-600">
            SCROLL&SHELF COMMUNITY
          </span>
        </div>
        <h1 className="text-4xl font-light text-gray-900">
          Connect, Share & <span className="font-serif italic">Discuss</span>
        </h1>
        <div className="mx-auto mt-4 h-px w-24 bg-gray-300" />
        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Dive into discussions, swap reviews, and spark conversations with fellow book lovers.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenModal}
          className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white text-sm font-medium rounded-full shadow-sm hover:bg-amber-700 transition"
        >
          <Plus size={18} />
          Create New Post
        </motion.button>
      </div>

      {/* Modal with backdrop */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative">
            <CreatePost onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommunityHero;
