import { useState, useEffect } from "react";
import axios from "axios";

export default function Subscriptions() {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          id: response.data.subscription_id,
          status: response.data.message.includes("already") ? "active" : "pre-booked",
          message: response.data.message
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
      <div className="bg-white shadow-md rounded-2xl p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-6">
        <div className="text-red-500 text-center py-4">
          {error}
          <button
            onClick={fetchSubscription}
            className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Subscription</h2>
      
      {subscription ? (
        <>
          <p className="text-gray-700 mb-2">
            <strong>Status:</strong>{" "}
            <span className={`capitalize ${subscription.status === "active" ? "text-green-600" : "text-blue-600"}`}>
              {subscription.status}
            </span>
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Subscription ID:</strong> {subscription.id}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Details:</strong> {subscription.message}
          </p>
        </>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No subscription information available
        </div>
      )}
    </div>
  );
}