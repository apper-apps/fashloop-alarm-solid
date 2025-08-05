class UserService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'app_User';
    this.investmentTableName = 'investment';
  }

  async getCurrentUser() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "stylecoins" } },
          { field: { Name: "ownedStylars" } },
          { field: { Name: "badges" } }
        ],
        pagingInfo: { limit: 1 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("User not found");
      }

      if (!response.data || response.data.length === 0) {
        throw new Error("User not found");
      }

      const user = response.data[0];
      
      // Get user investments
      const investments = await this.getUserInvestments(user.Id);
      
      return {
        ...user,
        investments: investments || []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching current user:", error?.response?.data?.message);
      } else {
        console.error("Error fetching current user:", error.message);
      }
      throw new Error("User not found");
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "stylecoins" } },
          { field: { Name: "ownedStylars" } },
          { field: { Name: "badges" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("User not found");
      }

      const user = response.data;
      
      // Get user investments
      const investments = await this.getUserInvestments(id);
      
      return {
        ...user,
        investments: investments || []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching user with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error("Error fetching user:", error.message);
      }
      throw new Error("User not found");
    }
  }

  async getUserInvestments(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "stylarId" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } }
        ],
        where: [
          {
            FieldName: "userId",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.investmentTableName, params);
      
      if (!response.success) {
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching user investments:", error.message);
      return [];
    }
  }

  async invest(stylarId, amount) {
    try {
      const currentUser = await this.getCurrentUser();
      
      if (currentUser.stylecoins < amount) {
        throw new Error("Insufficient StyleCoins");
      }

      // Create investment record
      const investmentParams = {
        records: [{
          stylarId: parseInt(stylarId),
          amount: parseInt(amount),
          date: new Date().toISOString(),
          userId: parseInt(currentUser.Id)
        }]
      };

      const investmentResponse = await this.apperClient.createRecord(this.investmentTableName, investmentParams);
      
      if (!investmentResponse.success) {
        throw new Error("Failed to create investment");
      }

      // Update user's stylecoins
      const userParams = {
        records: [{
          Id: parseInt(currentUser.Id),
          stylecoins: currentUser.stylecoins - amount
        }]
      };

      const userResponse = await this.apperClient.updateRecord(this.tableName, userParams);
      
      if (!userResponse.success) {
        throw new Error("Failed to update user coins");
      }

      return await this.getCurrentUser();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error making investment:", error?.response?.data?.message);
      } else {
        console.error("Error making investment:", error.message);
      }
      throw error;
    }
  }

  async updateCoins(amount) {
    try {
      const currentUser = await this.getCurrentUser();
      
      const params = {
        records: [{
          Id: parseInt(currentUser.Id),
          stylecoins: currentUser.stylecoins + amount
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error("Failed to update coins");
      }

      return await this.getCurrentUser();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating coins:", error?.response?.data?.message);
      } else {
        console.error("Error updating coins:", error.message);
      }
      throw error;
    }
  }
}

export const userService = new UserService();