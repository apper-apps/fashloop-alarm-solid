class StylerService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'stylar';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "images" } },
          { field: { Name: "style" } },
          { field: { Name: "value" } },
          { field: { Name: "score" } },
          { field: { Name: "created" } },
          { field: { Name: "description" } },
          { field: { Name: "creatorId" }, referenceField: { field: { Name: "Name" } } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(stylar => ({
        ...stylar,
        images: stylar.images ? stylar.images.split(',') : [],
        name: stylar.Name
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching stylars:", error?.response?.data?.message);
      } else {
        console.error("Error fetching stylars:", error.message);
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
          { field: { Name: "images" } },
          { field: { Name: "style" } },
          { field: { Name: "value" } },
          { field: { Name: "score" } },
          { field: { Name: "created" } },
          { field: { Name: "description" } },
          { field: { Name: "creatorId" }, referenceField: { field: { Name: "Name" } } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Stylar not found");
      }

      const stylar = response.data;
      return {
        ...stylar,
        images: stylar.images ? stylar.images.split(',') : [],
        name: stylar.Name
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching stylar with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error("Error fetching stylar:", error.message);
      }
      throw new Error("Stylar not found");
    }
  }

  async create(stylarData) {
    try {
      const params = {
        records: [{
          Name: stylarData.name || stylarData.Name,
          images: Array.isArray(stylarData.images) ? stylarData.images.join(',') : stylarData.images,
          style: stylarData.style,
          value: parseInt(stylarData.value || 100),
          score: parseInt(stylarData.score || 50),
          created: new Date().toISOString(),
          description: stylarData.description,
          creatorId: parseInt(stylarData.creatorId || 1)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to create stylar");
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} stylars:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create stylar");
        }
        
        const createdStyler = response.results[0].data;
        return {
          ...createdStyler,
          images: createdStyler.images ? createdStyler.images.split(',') : [],
          name: createdStyler.Name
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating stylar:", error?.response?.data?.message);
      } else {
        console.error("Error creating stylar:", error.message);
      }
      throw error;
    }
  }

  async updateValue(id, newValue) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          value: parseInt(newValue)
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to update stylar value");
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} stylars:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update stylar value");
        }
        
        const updatedStyler = response.results[0].data;
        return {
          ...updatedStyler,
          images: updatedStyler.images ? updatedStyler.images.split(',') : [],
          name: updatedStyler.Name
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating stylar value:", error?.response?.data?.message);
      } else {
        console.error("Error updating stylar value:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to delete stylar");
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} stylars:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete stylar");
        }
        
        return response.results.length > 0 && response.results[0].success;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting stylar:", error?.response?.data?.message);
      } else {
        console.error("Error deleting stylar:", error.message);
      }
      throw error;
    }
  }
}

export const stylarService = new StylerService();