import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { challengeService } from "@/services/api/challengeService";
import { stylarService } from "@/services/api/stylarService";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const ChallengeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadChallengeDetails();
  }, [id]);

  const loadChallengeDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      const challengeData = await challengeService.getById(parseInt(id));
      setChallenge(challengeData);
      
      // Load submitted stylars
      const allStylars = await stylarService.getAll();
      const challengeSubmissions = allStylars.filter(s => 
        challengeData.submissions.includes(s.Id)
      ).sort((a, b) => b.score - a.score);
      
      setSubmissions(challengeSubmissions);
    } catch (err) {
      setError("Failed to load challenge details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async () => {
    try {
      setJoining(true);
      
      // In a real app, this would create a submission entry
      toast.success("Joined challenge! Create a stylar to submit.");
      navigate("/create");
    } catch (error) {
      toast.error("Failed to join challenge. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const isActive = challenge && new Date() >= new Date(challenge.startDate) && new Date() <= new Date(challenge.endDate);
  const timeLeft = challenge ? formatDistanceToNow(new Date(challenge.endDate), { addSuffix: true }) : "";

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadChallengeDetails} />;
  if (!challenge) return <Error message="Challenge not found" />;

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
        Back to Challenges
      </Button>

      {/* Challenge Header */}
      <Card variant="premium" className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge 
                variant={isActive ? "success" : "secondary"} 
                size="sm"
              >
                {isActive ? "Active" : "Upcoming"}
              </Badge>
              <span className="text-gray-400">{timeLeft}</span>
            </div>
            
            <h1 className="font-display text-3xl font-bold gradient-text mb-3">
              {challenge.theme}
            </h1>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {challenge.description}
            </p>

            {/* Challenge Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ApperIcon name="Trophy" size={18} className="text-accent" />
                  <span className="text-gray-400 text-sm">Prize Pool</span>
                </div>
                <span className="text-2xl font-bold text-accent">500</span>
                <span className="text-gray-400 text-sm ml-1">SC</span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ApperIcon name="Users" size={18} className="text-primary" />
                  <span className="text-gray-400 text-sm">Participants</span>
                </div>
                <span className="text-2xl font-bold text-white">{challenge.submissions.length}</span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ApperIcon name="Calendar" size={18} className="text-secondary" />
                  <span className="text-gray-400 text-sm">Duration</span>
                </div>
                <span className="text-2xl font-bold text-white">7</span>
                <span className="text-gray-400 text-sm ml-1">days</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="lg:w-64">
            <Button
              variant={isActive ? "primary" : "secondary"}
              size="lg"
              className="w-full"
              onClick={handleJoinChallenge}
              disabled={!isActive || joining}
            >
              {joining ? (
                <>
                  <ApperIcon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Joining...
                </>
              ) : isActive ? (
                <>
                  <ApperIcon name="Zap" size={18} className="mr-2" />
                  Join Challenge
                </>
              ) : (
                <>
                  <ApperIcon name="Clock" size={18} className="mr-2" />
                  Coming Soon
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Challenge Rules */}
      <Card variant="surface" className="p-6">
        <h3 className="font-display text-xl font-bold text-white mb-4">
          Challenge Rules
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <ApperIcon name="Check" size={16} className="text-success mt-1" />
            <p className="text-gray-300">Create a stylar that fits the challenge theme</p>
          </div>
          <div className="flex items-start gap-3">
            <ApperIcon name="Check" size={16} className="text-success mt-1" />
            <p className="text-gray-300">Submit before the deadline</p>
          </div>
          <div className="flex items-start gap-3">
            <ApperIcon name="Check" size={16} className="text-success mt-1" />
            <p className="text-gray-300">Community votes determine the winner</p>
          </div>
          <div className="flex items-start gap-3">
            <ApperIcon name="Check" size={16} className="text-success mt-1" />
            <p className="text-gray-300">Winners receive StyleCoins and badges</p>
          </div>
        </div>
      </Card>

      {/* Leaderboard */}
      <Card variant="surface" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-white">
            Current Leaderboard
          </h3>
          <Badge variant="primary" size="sm">
            {submissions.length} entries
          </Badge>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Trophy" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No submissions yet</p>
            <p className="text-gray-500 text-sm">Be the first to join this challenge!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.slice(0, 10).map((submission, index) => (
              <div 
                key={submission.Id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer hover:bg-white/5 ${
                  index < 3 ? 'bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20' : 'bg-white/5'
                }`}
                onClick={() => navigate(`/stylar/${submission.Id}`)}
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-gradient-to-br from-accent to-warning' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                  'bg-white/10'
                }`}>
                  {index < 3 ? (
                    <ApperIcon name="Crown" size={16} className="text-background" />
                  ) : (
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  )}
                </div>

                {/* Submission Image */}
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img 
                    src={submission.images[0]} 
                    alt={submission.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Submission Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{submission.name}</h4>
                  <p className="text-gray-400 text-sm capitalize">{submission.style}</p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="font-bold text-accent text-lg">{submission.score}</p>
                  <p className="text-gray-400 text-xs">score</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChallengeDetails;