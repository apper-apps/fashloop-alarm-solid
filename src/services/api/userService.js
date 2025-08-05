import userData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...userData];
    this.currentUserId = 1; // Simulate logged-in user
  }

  async getCurrentUser() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = this.users.find(u => u.Id === this.currentUserId);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = this.users.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async invest(stylarId, amount) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userIndex = this.users.findIndex(u => u.Id === this.currentUserId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const user = this.users[userIndex];
    if (user.stylecoins < amount) {
      throw new Error("Insufficient StyleCoins");
    }

    // Update user's coins and investments
    this.users[userIndex] = {
      ...user,
      stylecoins: user.stylecoins - amount,
      investments: [
        ...user.investments,
        {
          stylarId: stylarId,
          amount: amount,
          date: new Date().toISOString()
        }
      ]
    };

    return { ...this.users[userIndex] };
  }

  async updateCoins(amount) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const userIndex = this.users.findIndex(u => u.Id === this.currentUserId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      stylecoins: this.users[userIndex].stylecoins + amount
    };

    return { ...this.users[userIndex] };
  }
}

export const userService = new UserService();