import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const BottomNav = () => {
  const navItems = [
    { path: "/", icon: "Home", label: "Home" },
    { path: "/challenges", icon: "Zap", label: "Challenges" },
    { path: "/portfolio", icon: "Briefcase", label: "Portfolio" },
    { path: "/profile", icon: "User", label: "Profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="glass border-t border-white/10 p-4">
        <div className="flex items-center justify-around relative">
          {navItems.slice(0, 2).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {/* Floating Create Button */}
          <NavLink to="/create">
            <Button
              variant="primary"
              size="lg"
              className="rounded-full w-14 h-14 shadow-2xl shadow-primary/30 -mt-6"
            >
              <ApperIcon name="Plus" size={24} />
            </Button>
          </NavLink>
          
          {navItems.slice(2).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;