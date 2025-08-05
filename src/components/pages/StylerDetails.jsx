import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { stylarService } from "@/services/api/stylarService";
import { userService } from "@/services/api/userService";
import { toast } from "react-toastify";

const StylerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stylar, setStyler] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [investing, setInvesting] = useState(false);
  const [investAmount, setInvestAmount] = useState(50);

  useEffect(() => {
    loadStylerDetails();
  }, [id]);

  const loadStylerDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [stylarData, userData] = await Promise.all([
        stylarService.getById(parseInt(id)),
        userService.getCurrentUser()
      ]);
      
      setStyler(stylarData);
      setUser(userData);
    } catch (err) {
      setError("Failed to load stylar details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    try {
      setInvesting(true);
      
      if (user.stylecoins < investAmount) {
        toast.error("Not enough StyleCoins!");
        return;
      }

      // Update user's coins and investments
      await userService.invest(stylar.Id, investAmount);
      
      // Update stylar value
      await stylarService.updateValue(stylar.Id, stylar.value + investAmount);
      
      // Update local state
      setUser(prev => ({
        ...prev,
        stylecoins: prev.stylecoins - investAmount,
        investments: [...prev.investments, { stylarId: stylar.Id, amount: investAmount, date: new Date() }]
      }));
      
      setStyler(prev => ({
        ...prev,
        value: prev.value + investAmount
      }));
      
      toast.success(`Invested ${investAmount} StyleCoins in ${stylar.name}!`);
    } catch (error) {
      toast.error("Investment failed. Please try again.");
    } finally {
      setInvesting(false);
    }
  };

  const getValueColor = (value) => {
    if (value >= 1000) return "text-accent";
    if (value >= 500) return "text-primary";
    return "text-secondary";
  };

  const isHighValue = stylar?.value >= 1000;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStylerDetails} />;
  if (!stylar) return <Error message="Stylar not found" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
        Back
      </Button>

      {/* Hero Section */}
      <Card 
        variant={isHighValue ? "premium" : "gradient"}
        className={`p-6 lg:p-8 ${isHighValue ? 'high-value-glow' : ''}`}
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img 
                src={stylar.images[0]} 
                alt={stylar.name}
                className="w-full h-full object-cover"
              />
            </div>
            {stylar.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {stylar.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${stylar.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-white">
                  {stylar.name}
                </h1>
                {isHighValue && (
                  <Badge variant="accent" size="sm">
                    <ApperIcon name="Crown" size={12} className="mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-gray-300 capitalize text-lg">
                {stylar.style} Style
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <ApperIcon name="TrendingUp" size={16} className={getValueColor(stylar.value)} />
                  <span className="text-gray-400 text-sm">Current Value</span>
                </div>
                <span className={`text-2xl font-bold ${getValueColor(stylar.value)}`}>
                  {stylar.value.toLocaleString()}
                </span>
                <span className="text-gray-400 text-sm ml-1">SC</span>
              </div>

              <div className="glass p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <ApperIcon name="Star" size={16} className="text-accent" />
                  <span className="text-gray-400 text-sm">Style Score</span>
                </div>
                <span className="text-2xl font-bold text-accent">
                  {stylar.score}
                </span>
                <span className="text-gray-400 text-sm ml-1">/100</span>
              </div>
            </div>

            {/* Investment Section */}
            <Card variant="surface" className="p-4">
              <h3 className="font-semibold text-white mb-4">Invest in this Stylar</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Investment Amount
                  </label>
                  <div className="flex gap-2">
                    {[25, 50, 100, 250].map((amount) => (
                      <Button
                        key={amount}
                        variant={investAmount === amount ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setInvestAmount(amount)}
                      >
                        {amount} SC
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Your balance:</span>
                  <span className="text-white font-medium">{user?.stylecoins || 0} SC</span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleInvest}
                  disabled={investing || (user?.stylecoins || 0) < investAmount}
                >
                  {investing ? (
                    <>
                      <ApperIcon name="Loader2" size={18} className="mr-2 animate-spin" />
                      Investing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="TrendingUp" size={18} className="mr-2" />
                      Invest {investAmount} SC
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card variant="surface" className="p-6">
        <h3 className="font-semibold text-white mb-4">Performance History</h3>
        <div className="h-64 glass rounded-xl flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">Performance chart coming soon</p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card variant="surface" className="p-6">
        <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: "Investment", amount: 75, time: "2 hours ago", user: "StyleFan123" },
            { action: "Investment", amount: 50, time: "5 hours ago", user: "TrendSetter" },
            { action: "Value Update", amount: 25, time: "1 day ago", user: "System" },
            { action: "Investment", amount: 100, time: "2 days ago", user: "FashionGuru" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon 
                    name={activity.action === "Investment" ? "Plus" : "TrendingUp"} 
                    size={14} 
                    className="text-white" 
                  />
                </div>
                <div>
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-400 text-xs">{activity.user}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-success font-medium text-sm">+{activity.amount} SC</p>
                <p className="text-gray-400 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StylerDetails;