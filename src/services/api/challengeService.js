import challengeData from "@/services/mockData/challenges.json";

class ChallengeService {
  constructor() {
    this.challenges = [...challengeData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.challenges];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const challenge = this.challenges.find(c => c.Id === id);
    if (!challenge) {
      throw new Error("Challenge not found");
    }
    return { ...challenge };
  }

  async create(challengeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.challenges.map(c => c.Id), 0);
    const newChallenge = {
      ...challengeData,
      Id: maxId + 1,
      submissions: []
    };
    
    this.challenges.push(newChallenge);
    return { ...newChallenge };
  }

  async addSubmission(challengeId, stylarId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const challengeIndex = this.challenges.findIndex(c => c.Id === challengeId);
    if (challengeIndex === -1) {
      throw new Error("Challenge not found");
    }
    
    if (!this.challenges[challengeIndex].submissions.includes(stylarId)) {
      this.challenges[challengeIndex].submissions.push(stylarId);
    }
    
    return { ...this.challenges[challengeIndex] };
  }
}

export const challengeService = new ChallengeService();