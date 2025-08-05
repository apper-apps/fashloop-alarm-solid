import React, { useState, useEffect } from "react";
import Sidebar from "@/components/molecules/Sidebar";
import BottomNav from "@/components/molecules/BottomNav";
import TopBar from "@/components/molecules/TopBar";
import { toast } from "react-toastify";
import { userService } from "@/services/api/userService";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    
    loadUser();
  }, []);

  const handleNotifications = () => {
    toast.info("No new notifications");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar user={user} onNotifications={handleNotifications} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 lg:px-6 pb-24 lg:pb-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;