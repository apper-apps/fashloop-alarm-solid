import React from "react";
import { cn } from "@/utils/cn";
import { forwardRef } from "react";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary-400 hover:to-secondary-400 focus:ring-primary shadow-lg hover:shadow-xl hover:shadow-primary/25 transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "glass text-white hover:bg-surface/80 focus:ring-secondary border border-white/10 hover:border-primary/30",
    accent: "bg-gradient-to-r from-accent to-warning text-background hover:from-accent-400 hover:to-warning-400 focus:ring-accent shadow-lg hover:shadow-xl hover:shadow-accent/25 transform hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-gray-300 hover:text-white hover:bg-white/5 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-500 hover:to-red-700 focus:ring-error shadow-lg hover:shadow-xl hover:shadow-error/25 transform hover:scale-[1.02] active:scale-[0.98]"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm h-9",
    md: "px-4 py-2.5 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
    xl: "px-8 py-4 text-lg h-14"
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;