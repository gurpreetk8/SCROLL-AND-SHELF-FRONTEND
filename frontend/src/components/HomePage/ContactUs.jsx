import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MessageSquare, ChevronDown, Send } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'General',
    message: ''
  });

  const inquiryTypes = ['General', 'Partnership', 'Technical Support', 'Content Request', 'Feedback'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    // Add your API call here
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-light text-gray-900">
            Get in <span className="font-serif italic">Touch</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Have questions or suggestions? Our literary consultants are ready to assist you in your reading journey.
          </p>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            {/* Decorative Sidebar */}
            <div className="hidden md:block bg-gradient-to-b from-blue-50 to-amber-50 p-12">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Personal Assistance</h3>
                    <p className="text-gray-600 mt-1">Dedicated support for your literary needs</p>
                  </div>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="space-y-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Average response time:</span> 2 hours
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Operating hours:</span> 24/7
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              <div className="space-y-6">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-blue-600 focus:outline-none bg-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-blue-600 focus:outline-none bg-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    className="w-full pl-4 pr-10 py-3 border-b border-gray-200 focus:border-blue-600 focus:outline-none appearance-none bg-transparent"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({...formData, inquiryType: e.target.value})}
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-blue-600 focus:outline-none bg-transparent"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;