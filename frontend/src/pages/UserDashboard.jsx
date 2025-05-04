import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Sidebar from "../components/Dashboard/Sidebar";
import ProfileSummary from "../components/Dashboard/ProfileSummary";
import MyLibrary from "../components/Dashboard/MyLibrary";
import Recommendations from "../components/Dashboard/Recommendations";
import Wishlist from "../components/Dashboard/Wishlist";
import Subscriptions from "../components/Dashboard/Subscription";
import CommunitySection from "../components/Dashboard/CommunitySection";
import SettingsLogout from "../components/Dashboard/SettingLogout";
import Navbar from "../components/HomePage/Navbar";
import Footer from "../components/HomePage/Footer";

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSummary />;
      case "library":
        return <MyLibrary />;
      case "recommendations":
        return <Recommendations />;
      case "wishlist":
        return <Wishlist/>;
      case "subscriptions":
        return <Subscriptions />;
      case "community":
        return <CommunitySection />;
      case "settings":
        return <SettingsLogout />;
      default:
        return <ProfileSummary />;
    }
  };

  return (
    <>
      <Helmet>
        <title>My Dashboard | Scroll & Shelf</title>
        <meta name="description" content="Manage your reading collection, activity, and community" />
      </Helmet>
      
      <Navbar />
      <div className="h-16" />
      
      {/* Main Dashboard Container */}
      <div className="flex min-h-[calc(100vh-8rem)] dashboard-bg">
        {/* Desktop Sidebar */}
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        {/* Mobile Bottom Nav */}
        <MobileNav activeSection={activeSection} setActiveSection={setActiveSection} />
        
        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 lg:p-10 transition-all 
              border border-purple-100/30 max-w-6xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
      
      <Footer />
    </>
  );
}

// Mobile Navigation Component
const MobileNav = ({ activeSection, setActiveSection }) => {
  const mobileSections = [
    { name: "Profile", key: "profile", icon: "👤" },
    { name: "Library", key: "library", icon: "📚" },
    { name: "Activity", key: "activity", icon: "🔔" },
    { name: "Community", key: "community", icon: "👥" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-lg">
      <div className="flex justify-around py-3 px-2">
        {mobileSections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`flex flex-col items-center px-2 py-1 text-xs transition-all ${
              activeSection === section.key 
                ? "text-purple-700 font-medium" 
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            <span className="text-lg mb-1">{section.icon}</span>
            <span>{section.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};