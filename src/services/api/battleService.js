class BattleService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'battle';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "votes1" } },
          { field: { Name: "votes2" } },
          { field: { Name: "voters" } },
          { field: { Name: "stylar1Id" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "stylar2Id" }, referenceField: { field: { Name: "Name" } } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching battles:", error?.response?.data?.message);
      } else {
        console.error("Error fetching battles:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "votes1" } },
          { field: { Name: "votes2" } },
          { field: { Name: "voters" } },
          { field: { Name: "stylar1Id" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "stylar2Id" }, referenceField: { field: { Name: "Name" } } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Battle not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching battle with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error("Error fetching battle:", error.message);
      }
      throw new Error("Battle not found");
    }
  }

  async vote(battleId, stylarId) {
    try {
      // First get the current battle
      const battle = await this.getById(battleId);
      
      // Check if user already voted
      const userId = "current-user";
      const currentVoters = battle.voters ? battle.voters.split(',') : [];
      
      if (currentVoters.includes(userId)) {
        throw new Error("Already voted in this battle");
      }

      // Update vote counts and voters
      const updatedData = {
        votes1: stylarId === battle.stylar1Id?.Id ? (battle.votes1 || 0) + 1 : battle.votes1 || 0,
        votes2: stylarId === battle.stylar2Id?.Id ? (battle.votes2 || 0) + 1 : battle.votes2 || 0,
        voters: currentVoters.length > 0 ? `${battle.voters},${userId}` : userId
      };

      const params = {
        records: [{
          Id: battleId,
          ...updatedData
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to cast vote");
      }

      return response.results[0].data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error casting vote:", error?.response?.data?.message);
      } else {
        console.error("Error casting vote:", error.message);
      }
      throw error;
    }
  }

  async create(battleData) {
    try {
      const params = {
        records: [{
          Name: battleData.Name || `Battle ${Date.now()}`,
          stylar1Id: parseInt(battleData.stylar1Id),
          stylar2Id: parseInt(battleData.stylar2Id),
          votes1: 0,
          votes2: 0,
          voters: ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to create battle");
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} battles:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create battle");
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating battle:", error?.response?.data?.message);
      } else {
        console.error("Error creating battle:", error.message);
      }
      throw error;
    }
  }
}

export const battleService = new BattleService();