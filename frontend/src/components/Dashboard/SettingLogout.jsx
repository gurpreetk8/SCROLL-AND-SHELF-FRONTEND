// components/Dashboard/SettingsLogout.jsx
export default function SettingsLogout() {
    const handleLogout = () => {
      // Add your logout logic here
      console.log("Logging out...");
    };
  
    return (
      <div className="bg-white shadow-md rounded-2xl p-6 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
        <p className="mb-4">Manage preferences, account settings, and privacy options here.</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Logout
        </button>
      </div>
    );
  }
  