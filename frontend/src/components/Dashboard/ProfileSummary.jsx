import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProfileSummary = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    selected_profile: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        profile_picture: "https://randomuser.me/api/portraits/men/1.jpg",
        phone_number: "+1 (555) 123-4567",
        selected_profile: "Premium Member"
      };
      
      setUserData(storedUser);
      setFormData({
        first_name: storedUser.first_name,
        last_name: storedUser.last_name,
        email: storedUser.email,
        phone_number: storedUser.phone_number || "",
        selected_profile: storedUser.selected_profile || "",
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    const updatedUser = { ...userData, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserData(updatedUser);
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl w-full max-w-2xl mx-auto border border-gray-100"
    >
      <div className="flex items-start mb-8">
        <div className="relative">
          <img
            src={`http://localhost:8000/media/${userData.profile_picture}`}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
          />
          {!editMode && (
            <button className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-all transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
        <div className="ml-6">
          <h2 className="text-3xl font-bold text-gray-800">Profile Summary</h2>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!editMode ? (
          <motion.div
            key="view-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">First Name</p>
                <p className="font-medium text-gray-800">{userData.first_name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="font-medium text-gray-800">{userData.last_name}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{userData.email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{userData.phone_number || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Profile Type</p>
                <p className="font-medium text-gray-800">{userData.selected_profile}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="edit-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Type</label>
                <select
                  name="selected_profile"
                  value={formData.selected_profile}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="Free">Free</option>
                  <option value="Premium Member">Premium Member</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileSummary;