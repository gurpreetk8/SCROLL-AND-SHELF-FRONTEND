import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ProfileSummary = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    username: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/users/";
  const token = localStorage.getItem("token");

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}user_details/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setUserData(response.data.user_details);
        setFormData({
          first_name: response.data.user_details.first_name,
          last_name: response.data.user_details.last_name,
          email: response.data.user_details.email,
          phone_number: response.data.user_details.phone_number || "",
          username: response.data.user_details.username || ""
        });
      } else {
        setError(response.data.message || "Failed to fetch user data");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const response = await axios.post(
        `${API_BASE_URL}edit_user_details/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.user_details);
        setSuccessMessage("Profile updated successfully!");
        setEditMode(false);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (err) => {
    console.error("API Error:", err);
    
    if (err.response) {
      if (err.response.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response.status === 404) {
        setError("User not found");
      } else {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      }
    } else if (err.request) {
      setError("Network error - please check your connection");
    } else {
      setError("Failed to process request");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    } else {
      setError("No authentication token found");
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading && !editMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-600"
      >
        <p className="font-medium">Error:</p>
        <p>{error}</p>
        <button
          onClick={fetchUserDetails}
          className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  if (!userData) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800">
        No user data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {successMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-600"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={userData.profile_picture || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-white shadow"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {userData.first_name} {userData.last_name}
            </h2>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editMode ? (
          <motion.form
            key="edit-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleEditSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setError(null);
                }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="view-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">First Name</p>
                <p className="font-medium">{userData.first_name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="font-medium">{userData.last_name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{userData.phone_number || "Not provided"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{userData.username || "Not set"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileSummary;