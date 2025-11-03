const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EventService {
  constructor() {
    // Initialize ApperClient for database operations
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    this.tableName = 'event_c';
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  }

  async getAll() {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "organizer_id_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching events:', error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "organizer_id_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Event not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error.message);
      throw error;
    }
  }

  async create(eventData) {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields based on schema
      const updateableData = {
        Name: eventData.Name,
        Tags: eventData.Tags,
        title_c: eventData.title_c,
        description_c: eventData.description_c,
        date_c: eventData.date_c,
        start_time_c: eventData.start_time_c,
        end_time_c: eventData.end_time_c,
        location_c: eventData.location_c,
        capacity_c: eventData.capacity_c ? parseInt(eventData.capacity_c) : null,
        category_c: eventData.category_c,
        image_url_c: eventData.image_url_c,
        is_featured_c: eventData.is_featured_c || false,
        organizer_id_c: eventData.organizer_id_c ? parseInt(eventData.organizer_id_c) : null,
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      };

      // Remove null/undefined values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === null || updateableData[key] === undefined || updateableData[key] === '') {
          delete updateableData[key];
        }
      });

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create event:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful[0]?.data;
      }

      return response.data;
    } catch (error) {
      console.error('Error creating event:', error.message);
      throw error;
    }
  }

  async update(id, eventData) {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields based on schema
      const updateableData = {
        Id: parseInt(id),
        Name: eventData.Name,
        Tags: eventData.Tags,
        title_c: eventData.title_c,
        description_c: eventData.description_c,
        date_c: eventData.date_c,
        start_time_c: eventData.start_time_c,
        end_time_c: eventData.end_time_c,
        location_c: eventData.location_c,
        capacity_c: eventData.capacity_c ? parseInt(eventData.capacity_c) : null,
        category_c: eventData.category_c,
        image_url_c: eventData.image_url_c,
        is_featured_c: eventData.is_featured_c,
        organizer_id_c: eventData.organizer_id_c ? parseInt(eventData.organizer_id_c) : null,
        updated_at_c: new Date().toISOString()
      };

      // Remove null/undefined/empty values except for Id
      Object.keys(updateableData).forEach(key => {
        if (key !== 'Id' && (updateableData[key] === null || updateableData[key] === undefined || updateableData[key] === '')) {
          delete updateableData[key];
        }
      });

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update event:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful[0]?.data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete event:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return { success: successful.length > 0 };
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error.message);
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "organizer_id_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching events by category ${category}:`, error.message);
      throw error;
    }
  }

  async getFeatured() {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "organizer_id_c"}}
        ],
        where: [{"FieldName": "is_featured_c", "Operator": "EqualTo", "Values": [true]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching featured events:', error.message);
      throw error;
    }
  }
}

export default new EventService();