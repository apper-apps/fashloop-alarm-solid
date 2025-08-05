import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChallengeCard from "@/components/molecules/ChallengeCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { challengeService } from "@/services/api/challengeService";

const Challenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    loadChallenges();
  }, [filter]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      setError("");
      
      const allChallenges = await challengeService.getAll();
      const now = new Date();
      
      let filteredChallenges = [];
      
      switch (filter) {
        case "active":
          filteredChallenges = allChallenges.filter(c => 
            new Date(c.startDate) <= now && new Date(c.endDate) >= now
          );
          break;
        case "upcoming":
          filteredChallenges = allChallenges.filter(c => 
            new Date(c.startDate) > now
          );
          break;
        case "completed":
          filteredChallenges = allChallenges.filter(c => 
            new Date(c.endDate) < now
          );
          break;
        default:
          filteredChallenges = allChallenges;
      }
      
      setChallenges(filteredChallenges);
    } catch (err) {
      setError("Failed to load challenges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: "active", label: "Active", icon: "Zap", count: challenges.filter(c => {
      const now = new Date();
      return new Date(c.startDate) <= now && new Date(c.endDate) >= now;
    }).length },
    { value: "upcoming", label: "Upcoming", icon: "Clock", count: challenges.filter(c => 
      new Date(c.startDate) > new Date()
    ).length },
    { value: "completed", label: "Completed", icon: "CheckCircle", count: challenges.filter(c => 
      new Date(c.endDate) < new Date()
    ).length }
  ];

  if (loading) return <Loading variant="grid" />;
  if (error) return <Error message={error} onRetry={loadChallenges} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            Style Challenges
          </h1>
          <p className="text-gray-400">
            Compete in weekly challenges and win StyleCoins
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <ApperIcon name="Trophy" size={16} className="text-accent" />
              <span className="text-sm text-gray-400">Total Prizes</span>
            </div>
            <span className="text-2xl font-bold text-white">2,500</span>
            <span className="text-gray-400 text-sm ml-1">SC</span>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <ApperIcon name="Users" size={16} className="text-primary" />
              <span className="text-sm text-gray-400">Participants</span>
            </div>
            <span className="text-2xl font-bold text-white">1,234</span>
          </div>
          
          <div className="glass p-4 rounded-xl col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <ApperIcon name="Calendar" size={16} className="text-secondary" />
              <span className="text-sm text-gray-400">This Week</span>
            </div>
            <span className="text-2xl font-bold text-white">3</span>
            <span className="text-gray-400 text-sm ml-1">active</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter(option.value)}
            className="whitespace-nowrap relative"
          >
            <ApperIcon name={option.icon} size={16} className="mr-2" />
            {option.label}
            {option.count > 0 && (
              <Badge variant="accent" size="sm" className="ml-2">
                {option.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Featured Challenge */}
      {filter === "active" && challenges.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl"></div>
          <div className="relative glass border border-primary/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="accent" size="sm">
                <ApperIcon name="Star" size={12} className="mr-1" />
                Featured
              </Badge>
              <Badge variant="success" size="sm">Live</Badge>
            </div>
            
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {challenges[0].theme}
            </h2>
            <p className="text-gray-300 mb-4 max-w-2xl">
              {challenges[0].description}
            </p>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <ApperIcon name="Trophy" size={18} className="text-accent" />
                <span className="text-white font-semibold">1,000 SC</span>
                <span className="text-gray-400">prize</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Users" size={18} className="text-primary" />
                <span className="text-white font-semibold">{challenges[0].submissions.length}</span>
                <span className="text-gray-400">entries</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" size={18} className="text-secondary" />
                <span className="text-white font-semibold">3 days</span>
                <span className="text-gray-400">left</span>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate(`/challenges/${challenges[0].Id}`)}
            >
              <ApperIcon name="Zap" size={18} className="mr-2" />
              Join Challenge
            </Button>
          </div>
        </div>
      )}

      {/* Challenges Grid */}
      {challenges.length === 0 ? (
        <Empty
          title={filter === "active" ? "No active challenges" : `No ${filter} challenges`}
          description="Check back soon for new exciting challenges!"
          actionLabel="View All Challenges"
          onAction={() => setFilter("all")}
          icon="Calendar"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.slice(filter === "active" ? 1 : 0).map((challenge) => (
            <ChallengeCard key={challenge.Id} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Challenges;