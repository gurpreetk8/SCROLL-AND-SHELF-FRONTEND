// components/Dashboard/Subscriptions.jsx
export default function Subscriptions() {
    const plan = "Premium Monthly";
    const renewalDate = "May 5, 2025";
  
    return (
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Subscription</h2>
        <p className="text-gray-700 mb-2">
          <strong>Current Plan:</strong> {plan}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Renewal Date:</strong> {renewalDate}
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Upgrade Plan
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Cancel Subscription
          </button>
        </div>
      </div>
    );
  }
  