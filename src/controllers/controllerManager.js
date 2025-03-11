export default class Controllers {
    constructor(service) {
      this.service = service;
    }
  
    async getAll(req, res) {
      try {
        const response = await this.service.getAll();
        res.json(response);
      } catch (error) {
        throw error;
        
      }
    }
  
    async getById(id) {
      try {
        const response = await this.service.getById(id);
        return response;
      } catch (error) {
        throw error;
      }
    }
    async create(data){
      try {
        const response = await this.service.create(data);
        return response;
      } catch (error) {
        throw error;
      }
    }
  
    async update(id, data) {
      try {
        
        const response = await this.service.update(id, data);
        return response;  
      } catch (error) {
       throw error;
      }
    }
    async delete(id) {
      try {
        const response = await this.service.delete(id);
        return response;
      } catch (error) {
        throw error;
      }
    }
  }