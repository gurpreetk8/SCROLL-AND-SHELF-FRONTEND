import { useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import ProfileSummary from "../components/Dashboard/ProfileSummary";
import MyLibrary from "../components/Dashboard/MyLibrary";
import Recommendations from "../components/Dashboard/Recommendations";
import Activity from "../components/Dashboard/Activity";
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
      case "activity":
        return <Activity />;
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
      <Navbar />
      <div className="h-16" />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 transition-all">
            {renderSection()}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}