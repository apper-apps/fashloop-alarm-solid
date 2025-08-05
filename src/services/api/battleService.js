import battleData from "@/services/mockData/battles.json";

class BattleService {
  constructor() {
    this.battles = [...battleData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.battles];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const battle = this.battles.find(b => b.Id === id);
    if (!battle) {
      throw new Error("Battle not found");
    }
    return { ...battle };
  }

  async vote(battleId, stylarId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const battleIndex = this.battles.findIndex(b => b.Id === battleId);
    if (battleIndex === -1) {
      throw new Error("Battle not found");
    }

    const battle = this.battles[battleIndex];
    const userId = "current-user"; // In real app, get from auth

    // Check if user already voted
    if (battle.voters.includes(userId)) {
      throw new Error("Already voted in this battle");
    }

    // Update vote counts
    if (stylarId === battle.stylar1Id) {
      battle.votes1 += 1;
    } else if (stylarId === battle.stylar2Id) {
      battle.votes2 += 1;
    } else {
      throw new Error("Invalid stylar ID for this battle");
    }

    // Add user to voters list
    battle.voters.push(userId);

    this.battles[battleIndex] = battle;
    return { ...battle };
  }

  async create(battleData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.battles.map(b => b.Id), 0);
    const newBattle = {
      ...battleData,
      Id: maxId + 1,
      votes1: 0,
      votes2: 0,
      voters: []
    };
    
    this.battles.push(newBattle);
    return { ...newBattle };
  }
}

export const battleService = new BattleService();