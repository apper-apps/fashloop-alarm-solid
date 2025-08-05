import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const ChallengeCard = ({ challenge }) => {
  const navigate = useNavigate();
  
  const isActive = new Date() >= new Date(challenge.startDate) && new Date() <= new Date(challenge.endDate);
  const timeLeft = formatDistanceToNow(new Date(challenge.endDate), { addSuffix: true });
  
  const handleJoin = (e) => {
    e.stopPropagation();
    navigate(`/challenges/${challenge.Id}`);
  };

  const handleCardClick = () => {
    navigate(`/challenges/${challenge.Id}`);
  };

  return (
    <Card 
      variant="gradient"
      hover={true}
      className="p-6 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant={isActive ? "success" : "secondary"} 
              size="sm"
            >
              {isActive ? "Active" : "Upcoming"}
            </Badge>
            <span className="text-gray-400 text-sm">{timeLeft}</span>
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-2">
            {challenge.theme}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {challenge.description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Users" size={16} className="text-primary" />
            <span className="text-white font-medium">{challenge.submissions.length}</span>
            <span className="text-gray-400 text-sm">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Trophy" size={16} className="text-accent" />
            <span className="text-white font-medium">500</span>
            <span className="text-gray-400 text-sm">SC prize</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Button
        variant={isActive ? "primary" : "secondary"}
        className="w-full"
        onClick={handleJoin}
        disabled={!isActive}
      >
        <ApperIcon name={isActive ? "Zap" : "Clock"} size={16} className="mr-2" />
        {isActive ? "Join Challenge" : "Coming Soon"}
      </Button>
    </Card>
  );
};

export default ChallengeCard;