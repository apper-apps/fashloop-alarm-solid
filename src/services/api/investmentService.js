class InvestmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'investment';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "stylarId" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "userId" }, referenceField: { field: { Name: "Name" } } }
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
        console.error("Error fetching investments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching investments:", error.message);
      }
      return [];
    }
  }

  async getByUserId(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
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

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user investments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching user investments:", error.message);
      }
      return [];
    }
  }

  async create(investmentData) {
    try {
      const params = {
        records: [{
          Name: `Investment ${Date.now()}`,
          stylarId: parseInt(investmentData.stylarId),
          amount: parseInt(investmentData.amount),
          date: investmentData.date || new Date().toISOString(),
          userId: parseInt(investmentData.userId)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to create investment");
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} investments:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create investment");
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating investment:", error?.response?.data?.message);
      } else {
        console.error("Error creating investment:", error.message);
      }
      throw error;
    }
  }
}

export const investmentService = new InvestmentService();