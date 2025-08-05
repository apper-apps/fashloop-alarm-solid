class ChallengeService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'challenge';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "theme" } },
          { field: { Name: "description" } },
          { field: { Name: "startDate" } },
          { field: { Name: "endDate" } },
          { field: { Name: "submissions" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(challenge => ({
        ...challenge,
        submissions: challenge.submissions ? challenge.submissions.split(',').map(id => parseInt(id)) : []
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching challenges:", error?.response?.data?.message);
      } else {
        console.error("Error fetching challenges:", error.message);
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
          { field: { Name: "theme" } },
          { field: { Name: "description" } },
          { field: { Name: "startDate" } },
          { field: { Name: "endDate" } },
          { field: { Name: "submissions" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Challenge not found");
      }

      const challenge = response.data;
      return {
        ...challenge,
        submissions: challenge.submissions ? challenge.submissions.split(',').map(id => parseInt(id)) : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching challenge with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error("Error fetching challenge:", error.message);
      }
      throw new Error("Challenge not found");
    }
  }

  async create(challengeData) {
    try {
      const params = {
        records: [{
          Name: challengeData.Name || challengeData.theme,
          theme: challengeData.theme,
          description: challengeData.description,
          startDate: challengeData.startDate,
          endDate: challengeData.endDate,
          submissions: ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to create challenge");
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} challenges:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create challenge");
        }
        
        const createdChallenge = response.results[0].data;
        return {
          ...createdChallenge,
          submissions: []
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating challenge:", error?.response?.data?.message);
      } else {
        console.error("Error creating challenge:", error.message);
      }
      throw error;
    }
  }

  async addSubmission(challengeId, stylarId) {
    try {
      const challenge = await this.getById(challengeId);
      
      const currentSubmissions = challenge.submissions || [];
      if (currentSubmissions.includes(parseInt(stylarId))) {
        return challenge;
      }

      const updatedSubmissions = [...currentSubmissions, parseInt(stylarId)];
      
      const params = {
        records: [{
          Id: parseInt(challengeId),
          submissions: updatedSubmissions.join(',')
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to add submission");
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} challenges:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to add submission");
        }
        
        const updatedChallenge = response.results[0].data;
        return {
          ...updatedChallenge,
          submissions: updatedChallenge.submissions ? updatedChallenge.submissions.split(',').map(id => parseInt(id)) : []
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding challenge submission:", error?.response?.data?.message);
      } else {
        console.error("Error adding challenge submission:", error.message);
      }
      throw error;
    }
  }
}

export const challengeService = new ChallengeService();