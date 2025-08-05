import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null,
  variant = "default" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="glass rounded-full p-6 mb-6">
        <ApperIcon 
          name="AlertTriangle" 
          size={48} 
          className="text-error animate-pulse" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-sm">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          className="px-6"
        >
          <ApperIcon name="RotateCcw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;