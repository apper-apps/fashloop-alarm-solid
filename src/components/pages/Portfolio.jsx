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

const Portfolio = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ownedStylars, setOwnedStylars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("owned");

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError("");
      
      const userData = await userService.getCurrentUser();
      setUser(userData);
      
      // Load owned stylars
      const allStylars = await stylarService.getAll();
      const userStylars = allStylars.filter(s => 
        userData.ownedStylars.includes(s.Id) || s.creatorId === userData.id
      );
      
      setOwnedStylars(userStylars);
    } catch (err) {
      setError("Failed to load portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculatePortfolioValue = () => {
    return ownedStylars.reduce((total, stylar) => total + stylar.value, 0);
  };

  const calculateTotalInvested = () => {
    return user?.investments?.reduce((total, inv) => total + inv.amount, 0) || 0;
  };

  const calculateProfit = () => {
    const currentValue = calculatePortfolioValue();
    const invested = calculateTotalInvested();
    return currentValue - invested;
  };

  const getProfitPercentage = () => {
    const invested = calculateTotalInvested();
    if (invested === 0) return 0;
    return ((calculateProfit() / invested) * 100).toFixed(1);
  };

  const tabs = [
    { value: "owned", label: "Owned Stylars", icon: "Crown" },
    { value: "investments", label: "Investments", icon: "TrendingUp" },
    { value: "history", label: "History", icon: "Clock" }
  ];

  if (loading) return <Loading variant="feed" />;
  if (error) return <Error message={error} onRetry={loadPortfolio} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold gradient-text mb-2">
          Your Portfolio
        </h1>
        <p className="text-gray-400">
          Track your investments and stylar performance
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="premium" className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-xl flex items-center justify-center">
              <ApperIcon name="Wallet" size={20} className="text-background" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Portfolio Value</p>
              <p className="text-2xl font-bold text-white">
                {calculatePortfolioValue().toLocaleString()}
                <span className="text-sm text-gray-400 ml-1">SC</span>
              </p>
            </div>
          </div>
        </Card>

        <Card variant="surface" className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Coins" size={20} className="text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available Coins</p>
              <p className="text-2xl font-bold text-white">
                {user?.stylecoins?.toLocaleString() || 0}
                <span className="text-sm text-gray-400 ml-1">SC</span>
              </p>
            </div>
          </div>
        </Card>

        <Card variant="surface" className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              calculateProfit() >= 0 
                ? 'bg-gradient-to-br from-success to-green-400' 
                : 'bg-gradient-to-br from-error to-red-400'
            }`}>
              <ApperIcon 
                name={calculateProfit() >= 0 ? "TrendingUp" : "TrendingDown"} 
                size={20} 
                className="text-white" 
              />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Profit/Loss</p>
              <p className={`text-2xl font-bold ${
                calculateProfit() >= 0 ? 'text-success' : 'text-error'
              }`}>
                {calculateProfit() >= 0 ? '+' : ''}{calculateProfit().toLocaleString()}
                <span className="text-sm text-gray-400 ml-1">SC</span>
              </p>
            </div>
          </div>
        </Card>

        <Card variant="surface" className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="BarChart3" size={20} className="text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Return</p>
              <p className={`text-2xl font-bold ${
                calculateProfit() >= 0 ? 'text-success' : 'text-error'
              }`}>
                {calculateProfit() >= 0 ? '+' : ''}{getProfitPercentage()}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.value)}
            className="flex-1"
          >
            <ApperIcon name={tab.icon} size={16} className="mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "owned" && (
        <div>
          {ownedStylars.length === 0 ? (
            <Empty
              title="No stylars owned"
              description="Start by creating your first stylar or investing in existing ones!"
              actionLabel="Create Stylar"
              onAction={() => navigate("/create")}
              icon="Crown"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedStylars.map((stylar) => (
                <StylerCard
                  key={stylar.Id}
                  stylar={stylar}
                  showInvestButton={false}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "investments" && (
        <div className="space-y-4">
          {user?.investments?.length === 0 ? (
            <Empty
              title="No investments yet"
              description="Start investing in stylars to build your portfolio!"
              actionLabel="Browse Stylars"
              onAction={() => navigate("/")}
              icon="TrendingUp"
            />
          ) : (
            <div className="space-y-4">
              {user?.investments?.map((investment, index) => (
                <Card key={index} variant="surface" className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                        <ApperIcon name="TrendingUp" size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          Investment #{investment.stylarId}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(investment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">
                        {investment.amount} SC
                      </p>
                      <Badge variant="success" size="sm">
                        +12.5%
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          <Card variant="surface" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-green-400 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Plus" size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Stylar Created</p>
                  <p className="text-gray-400 text-sm">Today</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">+100 SC</p>
                <p className="text-gray-400 text-sm">Initial value</p>
              </div>
            </div>
          </Card>

          <Card variant="surface" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Investment</p>
                  <p className="text-gray-400 text-sm">2 hours ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-error">-50 SC</p>
                <p className="text-gray-400 text-sm">Streetwear Stylar</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Portfolio;