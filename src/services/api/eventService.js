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

class EventService {
  constructor() {
}

  async getAll() {
    try {
      await delay(300); // Realistic API delay

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "organizer_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching events:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      await delay(250);

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "organizer_c"}},
          {"field": {"Name": "tags_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async create(eventData) {
    try {
      await delay(400);

      // Only include updateable fields
      const params = {
        records: [{
          name_c: eventData.name_c || "",
          description_c: eventData.description_c || "",
          date_c: eventData.date_c || "",
          time_c: eventData.time_c || "",
          location_c: eventData.location_c || "",
          category_c: eventData.category_c || "",
          capacity_c: eventData.capacity_c || 0,
          price_c: eventData.price_c || 0,
          status_c: eventData.status_c || "Draft",
          featured_c: eventData.featured_c || false,
          image_url_c: eventData.image_url_c || "",
          organizer_c: eventData.organizer_c || "",
          tags_c: eventData.tags_c || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} events: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating event:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async update(id, eventData) {
    try {
      await delay(350);

      // Only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: eventData.name_c,
          description_c: eventData.description_c,
          date_c: eventData.date_c,
          time_c: eventData.time_c,
          location_c: eventData.location_c,
          category_c: eventData.category_c,
          capacity_c: eventData.capacity_c,
          price_c: eventData.price_c,
          status_c: eventData.status_c,
          featured_c: eventData.featured_c,
          image_url_c: eventData.image_url_c,
          organizer_c: eventData.organizer_c,
          tags_c: eventData.tags_c
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} events: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating event:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      await delay(300);

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} events: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting event:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      await delay(300);

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "organizer_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching events by category:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getFeaturedEvents() {
    try {
      await delay(300);

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "organizer_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        where: [{"FieldName": "featured_c", "Operator": "EqualTo", "Values": [true]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching featured events:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
}

export default new EventService();
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  }

  async getAll() {
    await this.delay();
    return [...this.events];
  }

  async getById(id) {
    await this.delay();
    const event = this.events.find(event => event.Id === id);
    if (!event) {
      throw new Error("Event not found");
    }
    return { ...event };
  }

  async create(eventData) {
    await this.delay();
    const newEvent = {
      ...eventData,
      Id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, eventData) {
    await this.delay();
    const index = this.events.findIndex(event => event.Id === id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    
    this.events[index] = {
      ...this.events[index],
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.events[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.events.findIndex(event => event.Id === id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    
    this.events.splice(index, 1);
    return { success: true };
  }
}

export const eventService = new EventService();