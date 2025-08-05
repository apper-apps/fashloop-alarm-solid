import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TopBar = ({ user, onNotifications }) => {
  return (
    <div className="flex items-center justify-between p-4 lg:p-6">
      {/* Logo & Welcome */}
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <h1 className="font-display text-2xl font-bold gradient-text">
            Fashloop
          </h1>
        </div>
        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold text-white">
            Welcome back, {user?.username || "Fashionista"}!
          </h2>
          <p className="text-gray-400 text-sm">Ready to discover new trends?</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* StyleCoins */}
        <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl">
          <ApperIcon name="Coins" size={18} className="text-accent" />
          <span className="font-bold text-white">{user?.stylecoins || 0}</span>
          <span className="text-gray-400 text-sm">SC</span>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2"
          onClick={onNotifications}
        >
          <ApperIcon name="Bell" size={20} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
        </Button>
      </div>
    </div>
  );
};

export default TopBar;