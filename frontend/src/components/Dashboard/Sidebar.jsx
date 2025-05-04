export default function Sidebar({ activeSection, setActiveSection }) {
  const sections = [
    { name: "Profile", key: "profile" },
    { name: "My Library", key: "library" },
    { name: "Recommendations", key: "recommendations" },
    { name: "Wishlist", key: "wishlist" },
    { name: "Subscriptions", key: "subscriptions" },
    { name: "Community", key: "community" },
    { name: "Settings", key: "settings" },
  ];

  return (
    <aside className="w-64 bg-white p-6 hidden md:flex flex-col border-r border-gray-200
        h-[calc(100vh-8rem)] sticky top-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight border-b border-gray-200 pb-4">
        My Bookshelf
      </h2>
      
      <nav className="flex flex-col gap-1 flex-1">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`text-left px-4 py-3 rounded-lg transition-all font-medium
              flex items-center gap-3 ${
                activeSection === section.key
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
          >
            <span>{section.name}</span>
          </button>
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          Scroll & Shelf Pro Member
        </p>
      </div>
    </aside>
  );
}