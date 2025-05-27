import { useState, useEffect } from "react";
import axios from "axios";
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
  const [durationDays, setDurationDays] = useState(30);
  const [isCreating, setIsCreating] = useState(false);

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

  const createSubscription = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const res = await axios.post(
        `${API_BASE_URL}create_subscription/`,
        { duration_days: durationDays, amount_paid: 0.0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccessMessage("Subscription created successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        setSubscription({
          status: "active",
          startDate: res.data.start_date,
          endDate: res.data.end_date,
        });
      } else if (res.data.code === "SUBSCRIPTION_EXISTS") {
        setSubscription({
          status: "active",
          startDate: res.data.start_date,
          endDate: res.data.end_date,
        });
      } else setError(res.data.message || "Failed to create subscription");
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsCreating(false);
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
      <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-3">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        <p className="text-gray-600 text-sm">Loading subscription details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium text-sm">{error}</p>
            <button
              onClick={fetchSubscription}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------- JSX */
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <Zap className="text-yellow-500 h-4 w-4" />
        <span>My Subscription</span>
      </h2>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-3 p-2 bg-green-100 text-green-700 rounded text-xs"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {subscription ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {/* ACTIVE BADGE */}
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 p-2 rounded">
            <div className="bg-green-100 text-green-700 p-1 rounded-full">
              <CheckCircle className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs">
              <p className="font-medium capitalize">active</p>
              <p className="text-[10px] text-gray-500">
                {calculateDaysRemaining(subscription.endDate)} days remaining
              </p>
            </div>
          </div>

          {/* DATES */}
          <div className="space-y-2">
            {/* Start Date */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded p-2 text-xs">
              <Calendar className="h-3 w-3 mr-1 text-gray-500" />
              <span className="mr-1 text-gray-500">Start&nbsp;Date:</span>
              <span className="font-medium text-gray-800">
                {formatDate(subscription.startDate)}
              </span>
            </div>

            {/* End Date */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded p-2 text-xs">
              <Calendar className="h-3 w-3 mr-1 text-gray-500" />
              <span className="mr-1 text-gray-500">End&nbsp;Date:</span>
              <span className="font-medium text-gray-800">
                {formatDate(subscription.endDate)}
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ----------- No subscription UI ------------ */
        <div className="space-y-4">
          <p className="text-sm text-gray-700">You have no active subscription.</p>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value))}
              className="border rounded px-2 py-1 text-xs w-20"
              min={1}
            />
            <button
              onClick={createSubscription}
              disabled={isCreating}
              className={`px-3 py-1.5 rounded text-xs text-white ${
                isCreating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isCreating ? "Creating…" : "Subscribe"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
