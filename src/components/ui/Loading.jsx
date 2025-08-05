import React from "react";

const Loading = ({ variant = "default" }) => {
  if (variant === "feed") {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-lg w-2/3"></div>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg w-24"></div>
              <div className="h-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl mb-4"></div>
            <div className="h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg mb-2"></div>
            <div className="h-3 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-lg w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-secondary rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
};

export default Loading;