import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StylerCard from "@/components/molecules/StylerCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { userService } from "@/services/api/userService";
import { stylarService } from "@/services/api/stylarService";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [createdStylars, setCreatedStylars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      const userData = await userService.getCurrentUser();
      setUser(userData);
      
      // Load user's created stylars
      const allStylars = await stylarService.getAll();
      const userCreatedStylars = allStylars.filter(s => s.creatorId === userData.id);
      setCreatedStylars(userCreatedStylars);
    } catch (err) {
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProfileLevel = () => {
    const totalValue = createdStylars.reduce((sum, s) => sum + s.value, 0);
    if (totalValue >= 5000) return { level: "Legend", color: "accent", icon: "Crown" };
    if (totalValue >= 2000) return { level: "Expert", color: "primary", icon: "Star" };
    if (totalValue >= 500) return { level: "Rising", color: "secondary", icon: "TrendingUp" };
    return { level: "Newcomer", color: "success", icon: "Sparkles" };
  };

  const getTotalInvestors = () => {
    // In a real app, this would be calculated from actual investment data
    return createdStylars.reduce((sum, s) => sum + Math.floor(s.value / 50), 0);
  };

  const achievements = [
    { id: 1, name: "First Stylar", description: "Created your first stylar", icon: "Plus", earned: true },
    { id: 2, name: "Trending Creator", description: "Had a stylar reach 500+ value", icon: "TrendingUp", earned: createdStylars.some(s => s.value >= 500) },
    { id: 3, name: "Style Icon", description: "Reached 1000+ total portfolio value", icon: "Crown", earned: createdStylars.reduce((sum, s) => sum + s.value, 0) >= 1000 },
    { id: 4, name: "Community Favorite", description: "Received 100+ total investments", icon: "Heart", earned: getTotalInvestors() >= 100 },
    { id: 5, name: "Diversified", description: "Created stylars in 3+ different styles", icon: "Palette", earned: new Set(createdStylars.map(s => s.style)).size >= 3 },
    { id: 6, name: "High Scorer", description: "Had a stylar reach 90+ score", icon: "Target", earned: createdStylars.some(s => s.score >= 90) }
  ];

  const profileLevel = getProfileLevel();

  if (loading) return <Loading variant="feed" />;
  if (error) return <Error message={error} onRetry={loadProfile} />;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card variant="premium" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <ApperIcon name="User" size={32} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">
                {user?.username || "Fashionista"}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant={profileLevel.color} size="sm">
                  <ApperIcon name={profileLevel.icon} size={12} className="mr-1" />
                  {profileLevel.level}
                </Badge>
                <span className="text-gray-400 text-sm">
                  Member since 2024
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 grid grid-cols-3 gap-4 lg:max-w-md lg:ml-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{createdStylars.length}</p>
              <p className="text-gray-400 text-sm">Stylars</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{getTotalInvestors()}</p>
              <p className="text-gray-400 text-sm">Investors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">
                {createdStylars.reduce((sum, s) => sum + s.value, 0).toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm">Total Value</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="surface" className="p-4">
          <div className="flex items-center gap-3">
            <ApperIcon name="Coins" size={24} className="text-accent" />
            <div>
              <p className="text-lg font-bold text-white">
                {user?.stylecoins?.toLocaleString() || 0}
              </p>
              <p className="text-gray-400 text-xs">StyleCoins</p>
            </div>
          </div>
        </Card>

        <Card variant="surface" className="p-4">
          <div className="flex items-center gap-3">
            <ApperIcon name="Trophy" size={24} className="text-primary" />
            <div>
              <p className="text-lg font-bold text-white">
                {achievements.filter(a => a.earned).length}
              </p>
              <p className="text-gray-400 text-xs">Achievements</p>
            </div>
          </div>
        </Card>

        <Card variant="surface" className="p-4">
          <div className="flex items-center gap-3">
            <ApperIcon name="TrendingUp" size={24} className="text-success" />
            <div>
              <p className="text-lg font-bold text-white">
                {Math.max(...createdStylars.map(s => s.score), 0)}
              </p>
              <p className="text-gray-400 text-xs">Best Score</p>
            </div>
          </div>
        </Card>

        <Card variant="surface" className="p-4">
          <div className="flex items-center gap-3">
            <ApperIcon name="Palette" size={24} className="text-secondary" />
            <div>
              <p className="text-lg font-bold text-white">
                {new Set(createdStylars.map(s => s.style)).size}
              </p>
              <p className="text-gray-400 text-xs">Styles</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-4">
          Achievements
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id}
              variant={achievement.earned ? "premium" : "surface"}
              className={`p-4 ${achievement.earned ? '' : 'opacity-50'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  achievement.earned 
                    ? 'bg-gradient-to-br from-accent to-warning' 
                    : 'bg-white/10'
                }`}>
                  <ApperIcon 
                    name={achievement.icon} 
                    size={18} 
                    className={achievement.earned ? 'text-background' : 'text-gray-400'} 
                  />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${
                    achievement.earned ? 'text-white' : 'text-gray-400'
                  }`}>
                    {achievement.name}
                  </h3>
                </div>
                {achievement.earned && (
                  <ApperIcon name="Check" size={16} className="text-success" />
                )}
              </div>
              <p className={`text-xs ${
                achievement.earned ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {achievement.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Created Stylars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-white">
            Your Stylars
          </h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/create")}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create New
          </Button>
        </div>

        {createdStylars.length === 0 ? (
          <Empty
            title="No stylars created yet"
            description="Create your first stylar and start building your fashion empire!"
            actionLabel="Create Stylar"
            onAction={() => navigate("/create")}
            icon="Sparkles"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdStylars.map((stylar) => (
              <StylerCard
                key={stylar.Id}
                stylar={stylar}
                showInvestButton={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;