import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
const StylerCard = ({ stylar, showInvestButton = true, onInvest }) => {
  const navigate = useNavigate();

  const handleInvest = (e) => {
    e.stopPropagation();
    if (onInvest) {
      onInvest(stylar);
    } else {
      toast.success(`Invested 50 StyleCoins in ${stylar.name}!`);
    }
  };

  const handleCardClick = () => {
    navigate(`/stylar/${stylar.Id}`);
  };

  const getValueColor = (value) => {
    if (value >= 1000) return "text-accent";
    if (value >= 500) return "text-primary";
    return "text-secondary";
  };

  const isHighValue = stylar.value >= 1000;

  return (
    <Card 
      variant={isHighValue ? "premium" : "default"}
      hover={true}
      glow={isHighValue}
      className={cn(
        "p-4 fashion-card cursor-pointer",
        isHighValue && "high-value-glow"
      )}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="Sparkles" size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{stylar.name}</h3>
            <p className="text-gray-400 text-xs">{stylar.style}</p>
          </div>
        </div>
        <Badge 
          variant={stylar.score >= 80 ? "accent" : stylar.score >= 60 ? "primary" : "secondary"}
          size="sm"
        >
          {stylar.score}
        </Badge>
      </div>

      {/* Image */}
      <div className="relative mb-4 group">
        <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden">
          <img 
            src={stylar.images[0]} 
            alt={stylar.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {isHighValue && (
          <div className="absolute top-2 right-2">
            <Badge variant="accent" size="sm">
              <ApperIcon name="Crown" size={12} className="mr-1" />
              Premium
            </Badge>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ApperIcon name="TrendingUp" size={16} className={getValueColor(stylar.value)} />
          <span className={cn("font-bold text-lg", getValueColor(stylar.value))}>
            {stylar.value}
          </span>
          <span className="text-gray-400 text-sm">SC</span>
        </div>
        
        {showInvestButton && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleInvest}
            className="px-3"
          >
            <ApperIcon name="Plus" size={14} className="mr-1" />
            Invest
          </Button>
        )}
      </div>
    </Card>
  );
};

export default StylerCard;