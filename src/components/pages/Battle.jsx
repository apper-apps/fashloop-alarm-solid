import React, { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { battleService } from "@/services/api/battleService";
import { stylarService } from "@/services/api/stylarService";
import { toast } from "react-toastify";

const Battle = () => {
  const [battles, setBattles] = useState([]);
  const [currentBattle, setCurrentBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    loadBattles();
  }, []);

  const loadBattles = async () => {
    try {
      setLoading(true);
      setError("");
      
      const battlesData = await battleService.getAll();
      const stylarData = await stylarService.getAll();
      
      // Enrich battles with stylar data
      const enrichedBattles = battlesData.map(battle => ({
        ...battle,
        stylar1: stylarData.find(s => s.Id === battle.stylar1Id),
        stylar2: stylarData.find(s => s.Id === battle.stylar2Id)
      })).filter(battle => battle.stylar1 && battle.stylar2);
      
      setBattles(enrichedBattles);
      
      // Set first battle as current
      if (enrichedBattles.length > 0) {
        setCurrentBattle(enrichedBattles[0]);
      }
    } catch (err) {
      setError("Failed to load battles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (stylarId) => {
    if (!currentBattle || voting) return;
    
    try {
      setVoting(true);
      
      // Cast vote
      await battleService.vote(currentBattle.Id, stylarId);
      
      // Update local state
      setBattles(prev => prev.map(battle => {
        if (battle.Id === currentBattle.Id) {
          const updatedBattle = {
            ...battle,
            votes1: stylarId === battle.stylar1Id ? battle.votes1 + 1 : battle.votes1,
            votes2: stylarId === battle.stylar2Id ? battle.votes2 + 1 : battle.votes2,
            voters: [...battle.voters, "current-user"]
          };
          setCurrentBattle(updatedBattle);
          return updatedBattle;
        }
        return battle;
      }));
      
      toast.success("Vote cast successfully! +10 StyleCoins earned!");
      
      // Move to next battle after short delay
      setTimeout(() => {
        const currentIndex = battles.findIndex(b => b.Id === currentBattle.Id);
        const nextIndex = (currentIndex + 1) % battles.length;
        setCurrentBattle(battles[nextIndex]);
      }, 1500);
      
    } catch (error) {
      toast.error("Failed to cast vote. Please try again.");
    } finally {
      setVoting(false);
    }
  };

  const hasVoted = currentBattle?.voters?.includes("current-user");
  const totalVotes = (currentBattle?.votes1 || 0) + (currentBattle?.votes2 || 0);
  const vote1Percentage = totalVotes > 0 ? ((currentBattle?.votes1 || 0) / totalVotes * 100).toFixed(1) : 0;
  const vote2Percentage = totalVotes > 0 ? ((currentBattle?.votes2 || 0) / totalVotes * 100).toFixed(1) : 0;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBattles} />;
  if (!currentBattle) return <Empty title="No battles available" description="Check back soon for new style battles!" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Battle Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="success" size="sm">
            <ApperIcon name="Zap" size={12} className="mr-1" />
            Live Battle
          </Badge>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400 text-sm">
            Battle #{currentBattle.Id}
          </span>
        </div>
        
        <h1 className="font-display text-3xl font-bold gradient-text">
          Style Battle Arena
        </h1>
        
        <p className="text-gray-400 max-w-2xl mx-auto">
          Vote for your favorite style and earn StyleCoins! Each vote helps determine the most trending stylars.
        </p>
      </div>

      {/* Battle Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="surface" className="p-4 text-center">
          <ApperIcon name="Users" size={24} className="text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{totalVotes}</p>
          <p className="text-gray-400 text-sm">Total Votes</p>
        </Card>
        
        <Card variant="surface" className="p-4 text-center">
          <ApperIcon name="Trophy" size={24} className="text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-accent">10</p>
          <p className="text-gray-400 text-sm">SC per Vote</p>
        </Card>
        
        <Card variant="surface" className="p-4 text-center">
          <ApperIcon name="Timer" size={24} className="text-secondary mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{battles.length}</p>
          <p className="text-gray-400 text-sm">Battles Active</p>
        </Card>
      </div>

      {/* Main Battle */}
      <Card variant="premium" className="p-6 lg:p-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            Which style wins?
          </h2>
          <p className="text-gray-400">
            Tap on your favorite to vote
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stylar 1 */}
          <div 
            className={`group cursor-pointer transition-all duration-300 ${
              voting ? 'pointer-events-none' : ''
            } ${hasVoted ? 'pointer-events-none' : 'hover:scale-[1.02]'}`}
            onClick={() => !hasVoted && handleVote(currentBattle.stylar1Id)}
          >
            <Card variant="surface" className="p-4 h-full">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                <img 
                  src={currentBattle.stylar1.images[0]} 
                  alt={currentBattle.stylar1.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {hasVoted && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="primary" size="lg">
                      {vote1Percentage}% ({currentBattle.votes1} votes)
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-display text-xl font-bold text-white">
                  {currentBattle.stylar1.name}
                </h3>
                <p className="text-gray-400 capitalize">
                  {currentBattle.stylar1.style} Style
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="TrendingUp" size={14} className="text-primary" />
                    <span className="text-white font-medium">{currentBattle.stylar1.value}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Star" size={14} className="text-accent" />
                    <span className="text-white font-medium">{currentBattle.stylar1.score}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* VS Divider */}
          <div className="lg:hidden flex items-center justify-center py-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="font-display text-white font-bold text-lg">VS</span>
            </div>
          </div>

          {/* Stylar 2 */}
          <div 
            className={`group cursor-pointer transition-all duration-300 ${
              voting ? 'pointer-events-none' : ''
            } ${hasVoted ? 'pointer-events-none' : 'hover:scale-[1.02]'}`}
            onClick={() => !hasVoted && handleVote(currentBattle.stylar2Id)}
          >
            <Card variant="surface" className="p-4 h-full">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                <img 
                  src={currentBattle.stylar2.images[0]} 
                  alt={currentBattle.stylar2.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {hasVoted && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" size="lg">
                      {vote2Percentage}% ({currentBattle.votes2} votes)
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-display text-xl font-bold text-white">
                  {currentBattle.stylar2.name}
                </h3>
                <p className="text-gray-400 capitalize">
                  {currentBattle.stylar2.style} Style
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="TrendingUp" size={14} className="text-primary" />
                    <span className="text-white font-medium">{currentBattle.stylar2.value}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Star" size={14} className="text-accent" />
                    <span className="text-white font-medium">{currentBattle.stylar2.score}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* VS Divider Desktop */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
            <span className="font-display text-white font-bold text-lg">VS</span>
          </div>
        </div>

        {/* Vote Status */}
        {hasVoted && (
          <div className="text-center mt-8 pt-6 border-t border-white/10">
            <Badge variant="success" size="lg" className="mb-4">
              <ApperIcon name="Check" size={16} className="mr-2" />
              Vote Recorded! +10 SC Earned
            </Badge>
            <p className="text-gray-400 text-sm">
              Next battle loading...
            </p>
          </div>
        )}

        {voting && (
          <div className="text-center mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-2">
              <ApperIcon name="Loader2" size={16} className="animate-spin text-primary" />
              <span className="text-white">Casting your vote...</span>
            </div>
          </div>
        )}
      </Card>

      {/* Battle Queue */}
      <Card variant="surface" className="p-6">
        <h3 className="font-semibold text-white mb-4">Upcoming Battles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {battles.slice(1, 4).map((battle) => (
            <div key={battle.Id} className="glass p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-background">
                    <img 
                      src={battle.stylar1.images[0]} 
                      alt={battle.stylar1.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-background">
                    <img 
                      src={battle.stylar2.images[0]} 
                      alt={battle.stylar2.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {battle.stylar1.name} vs {battle.stylar2.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Battle #{battle.Id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Battle;