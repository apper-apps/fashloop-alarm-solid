import stylarData from "@/services/mockData/stylars.json";

class StylerService {
  constructor() {
    this.stylars = [...stylarData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.stylars];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stylar = this.stylars.find(s => s.Id === id);
    if (!stylar) {
      throw new Error("Stylar not found");
    }
    return { ...stylar };
  }

  async create(stylarData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const maxId = Math.max(...this.stylars.map(s => s.Id), 0);
    const newStyler = {
      ...stylarData,
      Id: maxId + 1,
      created: new Date().toISOString()
    };
    
    this.stylars.push(newStyler);
    return { ...newStyler };
  }

  async updateValue(id, newValue) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const stylarIndex = this.stylars.findIndex(s => s.Id === id);
    if (stylarIndex === -1) {
      throw new Error("Stylar not found");
    }
    
    this.stylars[stylarIndex] = {
      ...this.stylars[stylarIndex],
      value: newValue
    };
    
    return { ...this.stylars[stylarIndex] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.stylars.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Stylar not found");
    }
    
    this.stylars.splice(index, 1);
    return true;
  }
}

export const stylarService = new StylerService();