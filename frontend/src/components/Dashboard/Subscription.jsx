import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Calendar, CheckCircle, Clock } from "lucide-react";

export default function Subscriptions() {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [durationDays, setDurationDays] = useState(30);

  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/subscriptions/";
  const token = localStorage.getItem("token");

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_BASE_URL}pre_book_subscription/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSubscription({
          status: response.data.message.includes("already") ? "active" : "created",
          message: response.data.message,
          startDate: response.data.start_date,
          endDate: response.data.end_date,
        });
      } else {
        setError(response.data.message || "Failed to fetch subscription");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async () => {
    try {
      setIsLoading(true);
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
        setSubscription({
          status: "active",
          message: response.data.message,
          startDate: response.data.start_date,
          endDate: response.data.end_date,
        });
      } else {
        setError(response.data.message || "Failed to create subscription");
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

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={fetchSubscription}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <CheckCircle className="text-blue-500" />
        My Subscription
      </h2>

      {subscription ? (
        <div className="space-y-5">
          <div
            className={`p-4 rounded-lg ${
              subscription.status === "active" ? "bg-green-50" : "bg-blue-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  subscription.status === "active"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {subscription.status === "active" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Clock className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-700 capitalize">
                  {subscription.status}
                </p>
                <p className="text-sm text-gray-500">{subscription.message}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Start Date
              </p>
              <p className="font-medium text-gray-800 mt-1">
                {formatDate(subscription.startDate)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                End Date
              </p>
              <p className="font-medium text-gray-800 mt-1">
                {formatDate(subscription.endDate)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="bg-yellow-50 p-4 rounded-lg inline-flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <p className="text-gray-700">No active subscription found</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscription Duration
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) =>
                    setDurationDays(Math.max(1, parseInt(e.target.value) || 30))
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-3 text-gray-500">days</span>
              </div>
            </div>

            <button
              onClick={createSubscription}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Subscription"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
