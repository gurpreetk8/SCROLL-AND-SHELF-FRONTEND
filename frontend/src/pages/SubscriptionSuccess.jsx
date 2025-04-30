import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, PartyPopper, Rocket, Home, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import Navbar from '../components/HomePage/Navbar';
import Footer from '../components/HomePage/Footer';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [confettiPieces, setConfettiPieces] = useState(200);
  const [emojis] = useState(['🎉', '📚', '🎊', '🌟', '✨', '🥳']);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setConfettiPieces(0);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      {/* Confetti Celebration */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={confettiPieces}
        recycle={false}
        colors={['#F59E0B', '#FCD34D', '#FDE68A', '#FFFFFF']}
        gravity={0.15}
      />

      {/* Floating Emojis */}
      {emojis.map((emoji, index) => (
        <motion.div
          key={index}
          initial={{ y: height, x: Math.random() * width - width/2, rotate: 0 }}
          animate={{ 
            y: -200,
            x: Math.random() * 100 - 50,
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute text-4xl pointer-events-none"
          style={{ left: Math.random() * width }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="bg-gradient-to-br from-amber-50 to-white p-12 rounded-3xl shadow-2xl border border-amber-100 text-center max-w-2xl mx-6"
        >
          {/* Animated Checkmark */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-8"
          >
            <CheckCircle className="h-24 w-24 text-amber-600" strokeWidth={1.5} />
          </motion.div>

          {/* Content */}
          <h1 className="text-5xl font-light text-gray-900 mb-6">
            <span className="font-serif italic">Welcome</span> to the Club!
          </h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center space-x-4 mb-8"
          >
            <PartyPopper className="h-8 w-8 text-amber-600 animate-bounce" />
            <Sparkles className="h-8 w-8 text-amber-600 animate-pulse" />
            <Rocket className="h-8 w-8 text-amber-600 animate-bounce" />
          </motion.div>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your premium membership is now active! Dive into our extensive library<br />
            of curated ebooks and enjoy unlimited literary adventures.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Home className="h-6 w-6 mr-2" />
            Back to Home
          </motion.button>

          {/* Subtle Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-amber-100 rounded-full"
                style={{
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                }}
                animate={{
                  y: [0, 50, 0],
                  opacity: [0.8, 0],
                  scale: [1, 0.5]
                }}
                transition={{
                  duration: 2 + Math.random() * 5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background Sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-amber-100/30 rounded-full"
            style={{
              width: Math.random() * 15 + 5,
              height: Math.random() * 15 + 5,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, 100, 0],
              x: [0, 50, 0],
              rotate: 360,
              scale: [1, 0.5, 1]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;