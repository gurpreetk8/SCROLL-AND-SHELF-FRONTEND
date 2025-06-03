import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Mail, Phone, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.footer
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          {/* Left: Logo & Social */}
          <div className="flex flex-col md:items-start items-center space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-7 w-7 text-gray-900" />
              <span className="text-2xl font-semibold text-gray-900">
                Scroll<span className="font-light">&</span>Shelf
              </span>
            </div>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="p-2 border border-gray-200 rounded-full hover:border-gray-400 transition"
                >
                  <Icon className="h-5 w-5 text-gray-700 hover:text-gray-900 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Center: Links */}
          <div className="flex justify-center flex-wrap gap-x-6 text-[1.05rem] font-medium">
            {["About", "Genres", "Bestsellers", "Request"].map((label, idx) => {
              const paths = ["/about", "/Categories", "/bestsellers", "/request-book"];
              return (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  className="transition"
                >
                  <Link
                    to={paths[idx]}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Contact Info */}
          <div className="flex flex-col md:items-end items-center text-[1rem] space-y-3 text-gray-700">
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center transition">
              <Mail className="h-5 w-5 mr-2" />
              <span className="hover:text-gray-900 transition-colors">scrollshelf@gmail.com</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center transition">
              <Phone className="h-5 w-5 mr-2" />
              <span className="hover:text-gray-900 transition-colors">+91 6280638285</span>
            </motion.div>
          </div>
        </div>

        {/* Bottom Note */}
        <motion.div
          variants={fadeInUp}
          className="border-t border-gray-100 mt-10 pt-6 text-center"
        >
          <p className="text-gray-600 text-sm font-light">
            © {new Date().getFullYear()} Scroll&Shelf. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
