import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, BookOpen, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "New Arrivals", path: "/new" },
        { name: "Bestsellers", path: "/bestsellers" },
        { name: "Author Spotlights", path: "/authors" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", path: "/blog" },
        { name: "Reading Lists", path: "/lists" },
        { name: "Gift Cards", path: "/gifts" },
        { name: "FAQs", path: "/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Copyright", path: "/copyright" },
        { name: "Accessibility", path: "/accessibility" },
      ],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-8 w-8 stroke-[1.5] text-gray-900" />
              <span className="text-2xl font-medium tracking-tight text-gray-900">
                Scroll<span className="font-light">&</span>Shelf
              </span>
            </motion.div>
            <p className="text-gray-600 font-light leading-relaxed">
              Curating exceptional digital reading experiences for the discerning bibliophile.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="p-2 rounded-full border border-gray-200 hover:border-gray-300"
                  href="#"
                >
                  <Icon className="h-5 w-5 text-gray-600" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, index) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-medium tracking-widest text-gray-900">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-gray-900 font-light transition-colors flex items-start"
                    >
                      <span className="mr-2">↳</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-widest text-gray-900">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start text-gray-600">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="font-light">support@scrollshelf.com</span>
              </div>
              <div className="flex items-start text-gray-600">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="font-light">+1 (555) 321-9876</span>
              </div>
            </div>

            {/* Newsletter Form */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Join Our Newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-900"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors"
                >
                  Join
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-12 pt-8 text-center">
          <p className="text-gray-600 font-light">
            © {new Date().getFullYear()} Scroll & Shelf. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 font-light">
            Crafted with ♡ by bibliophiles, for bibliophiles
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;