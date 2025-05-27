import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Subscriptions() {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/subscriptions/";
  const token = localStorage.getItem("token");

  /* -------------------------------------------------- helpers */
  const formatDate = (dateString) =>
    !dateString
      ? "Not set"
      : new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const diff = new Date(endDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleApiError = (err) => {
    if (err.response) {
      if (err.response.status === 401)
        setError("Session expired. Please login again.");
      else if (err.response.status === 404)
        setError("User not found");
      else
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
    } else if (err.request) setError("Network error – please check your connection");
    else setError("Failed to process request");
  };

  /* -------------------------------------------------- API calls */
  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const res = await axios.post(
        `${API_BASE_URL}check_subscription/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.has_subscription) {
        setSubscription({
          status: "active",
          startDate: res.data.start_date,
          endDate: res.data.end_date,
        });
      } else setSubscription(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------- lifecycle */
  useEffect(() => {
    if (token) fetchSubscription();
    else {
      setError("No authentication token found");
      setIsLoading(false);
    }
  }, [token]);

  /* -------------------------------------------------- UI states */
  if (isLoading) {
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
          onClick={fetchSubscription}
          className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  /* -------------------------------------------------- JSX */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
        <Zap className="text-yellow-500 h-5 w-5" />
        <span>My Subscription</span>
      </h2>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-600 mb-6"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {subscription ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Status - Full width */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center mt-1">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <p className="font-medium capitalize">Active</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {calculateDaysRemaining(subscription.endDate)} days remaining
            </p>
          </div>

          {/* Dates - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Start Date</p>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <p className="font-medium">{formatDate(subscription.startDate)}</p>
              </div>
            </div>

            {/* End Date */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">End Date</p>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <p className="font-medium">{formatDate(subscription.endDate)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ----------- Updated No subscription UI ------------ */
        <div className="space-y-4">
          <p className="text-gray-700">You have no active subscription.</p>
          <button
            onClick={() => navigate('/subscribe')}
            className="px-4 py-2 rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            View Subscription Plans
          </button>
        </div>
      )}
    </motion.div>
  );
}