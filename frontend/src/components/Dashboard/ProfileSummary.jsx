import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ProfileSummary = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } else {
        setError(response.data.message || "Failed to fetch user data");
      }
    } catch (err) {
      console.error("API Error:", err);
      
      if (err.response) {
        // Server responded with error status (4xx, 5xx)
        if (err.response.status === 401) {
          setError("Please login again (session expired)");
        } else if (err.response.status === 404) {
          setError("User not found");
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error - please check your connection");
      } else {
        // Other errors
        setError("Failed to process request");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    } else {
      setError("No authentication token found");
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
        <span className="ml-3">Loading profile...</span>
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
        <p className="font-medium">Error loading profile:</p>
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
      className="space-y-4"
    >
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
      </div>
    </motion.div>
  );
};

export default ProfileSummary;