import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBook, FiHeart, FiBookmark, FiChevronRight } from "react-icons/fi";

export default function Activity() {
  const [activeTab, setActiveTab] = useState("history");
  
  const readingHistory = ["The Silent Patient", "Atomic Habits", "Dune"];
  const wishlist = ["Project Hail Mary", "The Midnight Library"];
  const bookmarks = ["Chapter 5: Advanced Techniques", "Appendix B: References"];

  const tabs = [
    { id: "history", label: "Reading History", icon: <FiBook /> },
    { id: "wishlist", label: "Wishlist", icon: <FiHeart /> },
    { id: "bookmarks", label: "Bookmarks", icon: <FiBookmark /> }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-xl mr-4">
          <FiBook className="text-blue-600 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Activity</h2>
          <p className="text-gray-500">Track your reading journey</p>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            <FiChevronRight className="ml-2" />
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "history" && (
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-700 mb-4 flex items-center">
                  <FiBook className="mr-2 text-green-500" />
                  Reading History
                </h3>
                <ul className="space-y-3">
                  {readingHistory.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="bg-green-500 w-2 h-2 rounded-full mr-3"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                  {readingHistory.length === 0 && (
                    <p className="text-gray-400 text-sm">No reading history yet</p>
                  )}
                </ul>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-700 mb-4 flex items-center">
                  <FiHeart className="mr-2 text-red-500" />
                  Wishlist
                </h3>
                <ul className="space-y-3">
                  {wishlist.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="bg-red-500 w-2 h-2 rounded-full mr-3"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                  {wishlist.length === 0 && (
                    <p className="text-gray-400 text-sm">Your wishlist is empty</p>
                  )}
                </ul>
              </div>
            )}

            {activeTab === "bookmarks" && (
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-700 mb-4 flex items-center">
                  <FiBookmark className="mr-2 text-purple-500" />
                  Bookmarks
                </h3>
                <ul className="space-y-3">
                  {bookmarks.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="bg-purple-500 w-2 h-2 rounded-full mr-3"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                  {bookmarks.length === 0 && (
                    <p className="text-gray-400 text-sm">No bookmarks saved</p>
                  )}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}