export default function Sidebar({ activeSection, setActiveSection }) {
    const sections = [
      { name: "Profile", key: "profile" },
      { name: "My Library", key: "library" },
      { name: "Recommendations", key: "recommendations" },
      { name: "Activity", key: "activity" },
      { name: "Subscriptions", key: "subscriptions" },
      { name: "Community", key: "community" },
      { name: "Settings", key: "settings" },
    ];
  
    return (
      <aside className="w-64 bg-white border-r shadow-md p-6 mt-10 mb-10 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold text-black mb-8">User Dashboard</h2>
        <nav className="flex flex-col gap-3">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`text-left px-4 py-2 rounded-lg transition font-medium ${
                activeSection === section.key
                  ? "bg-gray-600 text-white shadow"
                  : "hover:bg-gray-800 text-gray-700 hover:text-white"
              }`}
            >
              {section.name}
            </button>
          ))}
        </nav>
      </aside>
    );
  }
  