import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Calendar, CheckCircle, Clock, AlertCircle, Zap } from "lucide-react";

export default function Subscriptions() {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [durationDays, setDurationDays] = useState(30);
  const [isCreating, setIsCreating] = useState(false);

  const API_BASE_URL = "https://scrollandshelf.pythonanywhere.com/";
  const token = localStorage.getItem("token");

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

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
        await fetchSubscription(); // Refresh the subscription status
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
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto animate-fade-in">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto animate-fade-in">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-2" />
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
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Zap className="text-yellow-500" />
        My Subscription
      </h2>

      {subscription ? (
        <div className="space-y-5">
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

          <div className="pt-4">
            <button
              onClick={fetchSubscription}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Refresh Status
            </button>
          </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscription Duration
              </label>
              <div className="relative">
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value))}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
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
            </button>
          </div>
        </div>
      )}
    </div>
  );
}