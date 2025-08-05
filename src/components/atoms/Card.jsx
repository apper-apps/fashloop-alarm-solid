import React from "react";
import { cn } from "@/utils/cn";
import { forwardRef } from "react";

const Card = forwardRef(({
  children,
  variant = "default",
  hover = false,
  glow = false,
  className,
  ...props
}, ref) => {
  const baseStyles = "rounded-2xl transition-all duration-300";
  
  const variants = {
    default: "glass border border-white/10",
    surface: "bg-surface border border-white/5",
    gradient: "bg-gradient-to-br from-surface to-surface/50 border border-primary/20",
    premium: "glass border border-primary/30 shadow-2xl shadow-primary/10"
  };
  
  const hoverStyles = hover ? "hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 cursor-pointer" : "";
  const glowStyles = glow ? "animate-glow-pulse" : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        hoverStyles,
        glowStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;