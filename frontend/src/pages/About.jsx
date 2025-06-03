import { motion } from "framer-motion";
import Navbar from "../components/HomePage/Navbar";
import Footer from "../components/HomePage/Footer";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6 pt-24 pb-16"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-gray-900 mb-6"
          >
            <span className="text-slate-700">Scroll&Shelf</span>
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            For Those Who Want To Live A Thousand Lives Through Pages...
          </p>
          <p className="text-2xl font-semibold text-slate-700 mt-4">
            SCROLL IT, LOVE IT, SHELF IT!
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16 bg-slate-50 rounded-xl p-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At Scroll & Shelf, we believe in the transformative power of reading. Our mission is to create a digital sanctuary for book lovers—a place where discovery meets delight, and where every reader can find their perfect book match.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-slate-700 mb-3">Curated Selection</h3>
              <p className="text-gray-700">Each title in our collection is handpicked by our team of literary experts to ensure quality and diversity.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-slate-700 mb-3">Reader-Centric</h3>
              <p className="text-gray-700">We design every feature with the reading experience in mind, from personalized recommendations to comfortable reading interfaces.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
            Why Choose Scroll & Shelf?
          </h2>
          
          <div className="space-y-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all"
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-slate-100 text-slate-700 p-2 rounded-full mr-3">📚</span>
                Diverse Collection
              </h3>
              <p className="text-gray-700">
                Browse thousands of titles across all genres including fiction, non-fiction, fantasy, mystery, science fiction, biography, and more. We regularly update our collection with new releases and hidden gems.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all"
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-slate-100 text-slate-700 p-2 rounded-full mr-3">🔍</span>
                Smart Discovery
              </h3>
              <p className="text-gray-700">
                Our advanced recommendation engine learns your preferences to suggest books you'll love. Discover new arrivals, trending books, and personalized picks tailored just for you.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all"
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-slate-100 text-slate-700 p-2 rounded-full mr-3">💬</span>
                Vibrant Community
              </h3>
              <p className="text-gray-700">
                Join discussions in our community forums, participate in virtual book clubs, and share recommendations with fellow bibliophiles. Reading is better together!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Closing Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-20"
        >
          <p className="text-xl text-gray-700 mb-6">
            Ready to begin your reading journey?
          </p>
          <Link to="/ebooks">
            <button className="bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-md">
              Explore Our Library
            </button>
          </Link>
          <p className="mt-12 text-gray-500 italic">
            "A reader lives a thousand lives before he dies. The man who never reads lives only one."<br />
            - George R.R. Martin
          </p>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default About;