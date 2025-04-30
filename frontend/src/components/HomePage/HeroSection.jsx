import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/80" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-20 top-1/4 h-32 w-32 rounded-full bg-amber-100/30 blur-3xl" />
      <div className="absolute left-40 bottom-1/3 h-40 w-40 rounded-full bg-blue-100/20 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-8">
        <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="mb-4 flex items-center space-x-3">
                <div className="h-px w-16 bg-gray-900" />
                <span className="text-sm font-medium tracking-widest text-gray-600">
                  PREMIUM EBOOKS
                </span>
              </div>
              
              <motion.h1
                className="text-5xl font-light leading-tight text-gray-900 md:text-6xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="font-serif italic">Curated</span> literature for{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">discerning</span>
                  <span className="absolute bottom-2 left-0 z-0 h-3 w-full bg-amber-100/60" />
                </span>{" "}
                readers
              </motion.h1>

              <motion.p
                className="mt-6 max-w-md text-lg font-light text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Discover rare editions and timeless classics in our exclusive digital collection.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex space-x-4"
            >
              <Link to="/ebooks">
                <motion.button
                  whileHover={{ y: -2 }}
                  className="flex items-center space-x-2 border border-gray-900 bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  <span>Browse Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <Link to="/membership">
                <motion.button
                  whileHover={{ y: -2 }}
                  className="flex items-center space-x-2 border border-gray-900 px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  <span>Membership</span>
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Book Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden items-center justify-center md:flex"
          >
            <div className="relative h-96 w-72">
              <div className="absolute -left-8 -top-8 h-full w-full border border-gray-300" />
              <div className="relative z-10 flex h-full w-full items-center justify-center border border-gray-900 bg-white p-8 shadow-xl">
                <div className="absolute -right-8 -bottom-8 h-16 w-16 bg-amber-100" />
                <BookOpen className="h-32 w-32 stroke-1 text-gray-900" />
                <div className="absolute -left-4 top-1/2 h-32 w-8 -translate-y-1/2 border-l border-gray-200" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrolling Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-8 w-5 rounded-full border-2 border-gray-900">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="mx-auto mt-1 h-2 w-1 bg-gray-900"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;