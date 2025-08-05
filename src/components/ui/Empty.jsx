import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet",
  description = "Be the first to create something amazing!",
  actionLabel = "Get Started",
  onAction = null,
  icon = "Sparkles",
  variant = "default"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="glass rounded-full p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse"></div>
        <ApperIcon 
          name={icon} 
          size={56} 
          className="text-primary relative z-10" 
        />
      </div>
      
      <h3 className="text-2xl font-display font-bold gradient-text mb-3">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          size="lg"
          className="px-8"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;