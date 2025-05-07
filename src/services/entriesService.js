import { db } from '../db/db';

export const entriesService = {
  // Get all entries
  async getAllEntries() {
    return await db.entries.toArray();
  },
  
  // Get entry by ID
  async getEntryById(id) {
    return await db.entries.get(id);
  },
  
  // Create new entry
  async createEntry(entry) {
    const now = new Date();
    const newEntry = {
      ...entry,
      dateCreated: now,
      dateModified: now
    };
    return await db.entries.add(newEntry);
  },
  
  // Update existing entry
  async updateEntry(entry) {
    const updatedEntry = {
      ...entry,
      dateModified: new Date()
    };
    await db.entries.update(entry.id, updatedEntry);
    return entry.id;
  },
  
  // Delete entry
  async deleteEntry(id) {
    return await db.entries.delete(id);
  },
  
  // Get recent entries (for dashboard)
  async getRecentEntries(limit = 10) {
    return await db.entries
      .orderBy('dateCreated')
      .reverse()
      .limit(limit)
      .toArray();
  },
  
  // Filter entries
  async getFilteredEntries({ type, dateRange, tagIds, searchText }) {
    let collection = db.entries.orderBy('dateCreated').reverse();
    
    // Apply type filter if provided
    if (type && type !== 'All Types') {
      collection = collection.filter(entry => entry.type === type);
    }
    
    // Get all entries that match
    let entries = await collection.toArray();
    
    // Apply date range filter
    if (dateRange && dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      
      end.setHours(23, 59, 59, 999);
      
      entries = entries.filter(entry => {
        const entryDate = new Date(entry.dateCreated);
        return entryDate >= start && entryDate <= end;
      });
    }
    
    // Apply tag filter 
    if (tagIds && tagIds.length > 0) {
      entries = entries.filter(entry => {
        return entry.tagIds && tagIds.every(tagId => entry.tagIds.includes(tagId));
      });
    }
    
    // Apply search text filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      entries = entries.filter(entry => {
        const titleMatch = entry.title.toLowerCase().includes(searchLower);
        const bodyMatch = entry.body.toLowerCase().includes(searchLower);
        return titleMatch || bodyMatch;
      });
    }
    
    return entries;
  }
};

export default entriesService;