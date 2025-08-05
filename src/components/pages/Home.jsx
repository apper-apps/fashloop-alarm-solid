import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StylerCard from "@/components/molecules/StylerCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { stylarService } from "@/services/api/stylarService";
import { userService } from "@/services/api/userService";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [stylars, setStylars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("trending");
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [stylarsData, userData] = await Promise.all([
        stylarService.getAll(),
        userService.getCurrentUser()
      ]);
      
      let filteredStylars = [...stylarsData];
      
      // Apply filtering logic
      switch (filter) {
        case "trending":
          filteredStylars = filteredStylars.sort((a, b) => b.score - a.score);
          break;
        case "new":
          filteredStylars = filteredStylars.sort((a, b) => new Date(b.created) - new Date(a.created));
          break;
        case "high-value":
          filteredStylars = filteredStylars.filter(s => s.value >= 500).sort((a, b) => b.value - a.value);
          break;
        default:
          break;
      }
      
      setStylars(filteredStylars);
      setUser(userData);
    } catch (err) {
      setError("Failed to load stylars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (stylar) => {
    try {
      const investmentAmount = 50;
      
      if (user.stylecoins < investmentAmount) {
        toast.error("Not enough StyleCoins!");
        return;
      }

      // Update user's coins and investments
      await userService.invest(stylar.Id, investmentAmount);
      
      // Update stylar value
      await stylarService.updateValue(stylar.Id, stylar.value + investmentAmount);
      
      // Update local state
      setUser(prev => ({
        ...prev,
        stylecoins: prev.stylecoins - investmentAmount,
        investments: [...prev.investments, { stylarId: stylar.Id, amount: investmentAmount, date: new Date() }]
      }));
      
      setStylars(prev => prev.map(s => 
        s.Id === stylar.Id ? { ...s, value: s.value + investmentAmount } : s
      ));
      
toast.success(`Invested ${investmentAmount} StyleCoins in ${stylar.name || stylar.Name}!`);
    } catch (error) {
      toast.error("Investment failed. Please try again.");
    }
  };

  const filterOptions = [
    { value: "trending", label: "Trending", icon: "TrendingUp" },
    { value: "new", label: "New", icon: "Clock" },
    { value: "high-value", label: "High Value", icon: "Crown" }
  ];

  if (loading) return <Loading variant="feed" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            Style Feed
          </h1>
          <p className="text-gray-400">
            Discover and invest in the hottest fashion trends
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className="whitespace-nowrap"
            >
              <ApperIcon name={option.icon} size={16} className="mr-2" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <ApperIcon name="Users" size={16} className="text-primary" />
            <span className="text-sm text-gray-400">Active Stylars</span>
          </div>
          <span className="text-2xl font-bold text-white">{stylars.length}</span>
        </div>
        
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <ApperIcon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm text-gray-400">Market Cap</span>
          </div>
          <span className="text-2xl font-bold text-white">
            {stylars.reduce((sum, s) => sum + s.value, 0).toLocaleString()}
          </span>
        </div>
        
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <ApperIcon name="Crown" size={16} className="text-accent" />
            <span className="text-sm text-gray-400">Top Value</span>
          </div>
          <span className="text-2xl font-bold text-white">
            {Math.max(...stylars.map(s => s.value), 0)}
          </span>
        </div>
        
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <ApperIcon name="Zap" size={16} className="text-secondary" />
            <span className="text-sm text-gray-400">Your Coins</span>
          </div>
          <span className="text-2xl font-bold text-white">
            {user?.stylecoins || 0}
          </span>
        </div>
      </div>

      {/* Stylars Grid */}
      {stylars.length === 0 ? (
        <Empty
          title="No stylars found"
          description="Be the first to create a stylar and start the trend!"
          actionLabel="Create Stylar"
          onAction={() => navigate("/create")}
          icon="Sparkles"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stylars.map((stylar) => (
            <StylerCard
              key={stylar.Id}
              stylar={stylar}
              onInvest={handleInvest}
              showInvestButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;