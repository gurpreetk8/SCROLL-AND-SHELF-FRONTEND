import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, LibraryBig, Award, ArrowUp } from 'lucide-react';

const BookStats = () => {
  const stats = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      value: "1.2M+",
      title: "Digital Volumes",
      description: "Curated collection of rare & popular titles",
      trend: "+15.3%"
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: "458K+",
      title: "Active Readers",
      description: "Join our community of literary enthusiasts",
      trend: "+22.1%"
    },
    {
      icon: <LibraryBig className="h-8 w-8" />,
      value: "32K+",
      title: "Unique Categories",
      description: "From classic literature to modern genres",
      trend: "+8.4%"
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: "150+",
      title: "Award Winners",
      description: "Nobel, Booker & Pulitzer prize collections",
      trend: "+5.7%"
    }
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-light text-gray-900">
            Literary <span className="font-serif italic">Excellence</span> in Numbers
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-8 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              {/* Trend Badge */}
              <div className="absolute top-4 right-4 flex items-center text-emerald-600">
                <ArrowUp className="h-4 w-4" />
                <span className="ml-1 text-sm font-medium">{stat.trend}</span>
              </div>

              {/* Icon Container */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-lg">
                  {React.cloneElement(stat.icon, { className: "h-8 w-8 text-amber-600" })}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-4xl font-light text-gray-900">{stat.value}</h3>
                <div className="space-y-2">
                  <h4 className="text-xl font-medium text-gray-900">{stat.title}</h4>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>

              {/* Hover Effect Elements */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-amber-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute -z-10 inset-0 rounded-xl bg-gradient-to-br from-white via-amber-50/20 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Decorative Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 font-light">
            * Updated in real-time • Trusted by literary institutions worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BookStats;