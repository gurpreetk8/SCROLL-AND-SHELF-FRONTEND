import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Zap,
  ArrowLeft,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Subscriptions() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [durationDays, setDurationDays] = useState(30);
  const [isCreating, setIsCreating] = useState(false);

  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/";
  const token = localStorage.getItem("token");

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      if (!token) {
        setError("Please login to view subscriptions");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}check_subscription/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        if (response.data.has_subscription) {
          setSubscription({
            status: "active",
            message: "Your subscription is active",
            startDate: response.data.start_date,
            endDate: response.data.end_date,
          });
        } else {
          setSubscription(null);
        }
      } else {
        setError(response.data.message || "Failed to check subscription status");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const response = await axios.post(
        `${API_BASE_URL}pre_book_subscription/`,
        { duration_days: durationDays },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message || "Subscription created successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
        await fetchSubscription();
      } else {
        setError(response.data.message || "Failed to create subscription");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleApiError = (err) => {
    console.error("API Error:", err);

    if (err.response) {
      if (err.response.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      } else if (err.response.status === 404) {
        setError("User not found. Please register or contact support.");
      } else {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      }
    } else if (err.request) {
      setError("Network error - please check your connection");
    } else {
      setError("Failed to process request");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    if (token) {
      fetchSubscription();
    } else {
      setError("No authentication token found");
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <Heart className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Subscription</h2>
            <p className="text-gray-500">Manage your reading access</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <Heart className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Subscription</h2>
            <p className="text-gray-500">Manage your reading access</p>
          </div>
        </div>
        <div className="text-red-500 text-center py-4">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          {error}
          {error.includes("login") ? (
            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
          ) : (
            <button
              onClick={fetchSubscription}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-xl mr-4">
          <Heart className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Subscription</h2>
          <p className="text-gray-500">Manage your reading access</p>
        </div>
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        {subscription ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Active Subscription</p>
                  <p className="text-sm text-gray-500">
                    {calculateDaysRemaining(subscription.endDate)} days remaining
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </p>
                <p className="font-medium text-gray-800 mt-1">
                  {formatDate(subscription.startDate)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  End Date
                </p>
                <p className="font-medium text-gray-800 mt-1">
                  {formatDate(subscription.endDate)}
                </p>
              </div>
            </div>

            <button
              onClick={fetchSubscription}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Refresh Status
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 inline-flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <p className="text-gray-700">No active subscription found</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Duration
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value))}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createSubscription}
                disabled={isCreating}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Activate Subscription
                  </>
                )}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}