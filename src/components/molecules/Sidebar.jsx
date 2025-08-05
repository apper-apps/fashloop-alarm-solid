import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import LogoutButton from "@/components/atoms/LogoutButton";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const navItems = [
    { path: "/", icon: "Home", label: "Home Feed" },
    { path: "/create", icon: "Plus", label: "Create Stylar" },
    { path: "/challenges", icon: "Zap", label: "Challenges" },
    { path: "/battle", icon: "Sword", label: "Battle Arena" },
    { path: "/portfolio", icon: "Briefcase", label: "Portfolio" },
    { path: "/profile", icon: "User", label: "Profile" }
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-surface lg:border-r lg:border-white/10">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="Sparkles" size={20} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold gradient-text">
            Fashloop
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
</nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="glass p-4 rounded-xl mb-4">
          <h3 className="font-semibold text-white mb-2">Pro Tip</h3>
          <p className="text-gray-400 text-sm">
            Invest early in trending styles to maximize your StyleCoins!
          </p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;