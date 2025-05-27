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
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [durationDays, setDurationDays] = useState(30);
  const [isCreating, setIsCreating] = useState(false);

  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/subscriptions/";
  const token = localStorage.getItem("token");

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

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
            message: "Active subscription found",
            startDate: null,
            endDate: response.data.end_date,
          });
        } else {
          setSubscription(null);
        }
      } else {
        setError("Failed to check subscription status");
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
        `${API_BASE_URL}create_subscription/`,
        {
          duration_days: durationDays,
          amount_paid: 0.0, // or allow user to input this
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Subscription created successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        setSubscription({
          status: "active",
          message: response.data.message,
          startDate: response.data.start_date,
          endDate: response.data.end_date,
        });
      } else {
        if (response.data.code === "SUBSCRIPTION_EXISTS") {
          setSubscription({
            status: "active",
            message: response.data.message,
            startDate: null,
            endDate: null,
          });
        } else {
          setError(response.data.message || "Failed to create subscription");
        }
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

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
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
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{error}</p>
            <button
              onClick={fetchSubscription}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <Zap className="text-yellow-500 h-5 w-5" />
        <span>My Subscription</span>
      </h2>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm"
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
          <div className={`p-3 rounded border ${
            subscription.status === "active" 
              ? "bg-green-50 border-green-200" 
              : "bg-blue-50 border-blue-200"
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-full ${
                subscription.status === "active"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}>
                {subscription.status === "active" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-700 capitalize">
                  {subscription.status}
                </p>
                <p className="text-xs text-gray-500">
                  {subscription.status === "active" && (
                    <>{calculateDaysRemaining(subscription.endDate)} days remaining</>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-500 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Start Date</span>
              </p>
              <p className="font-medium text-gray-800 mt-1 text-sm">
                {formatDate(subscription.startDate)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-500 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>End Date</span>
              </p>
              <p className="font-medium text-gray-800 mt-1 text-sm">
                {formatDate(subscription.endDate)}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700">You have no active subscription.</p>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value))}
              className="border rounded px-3 py-1 text-sm w-24"
              min={1}
            />
            <button
              onClick={createSubscription}
              disabled={isCreating}
              className={`px-4 py-1.5 rounded text-sm text-white ${
                isCreating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isCreating ? "Creating..." : "Subscribe"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
