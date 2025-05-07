import { db } from '../db/db';

export const tagsService = {
  // Get all tags
  async getAllTags() {
    return await db.tags.toArray();
  },
  
  // Get tags by category
  async getTagsByCategory(category) {
    return await db.tags
      .where('category')
      .equals(category)
      .toArray();
  },
  
  // Get tags by IDs
  async getTagsByIds(ids) {
    if (!ids || !ids.length) return [];
    return await db.tags.where('id').anyOf(ids).toArray();
  },
  
  // Create new tag
  async createTag(name, category) {
    const existingTag = await db.tags.where('name').equals(name).first();
    if (existingTag) return existingTag.id;
    
    return await db.tags.add({
      name,
      category: category || 'Custom'
    });
  },
  
  // Update tag
  async updateTag(id, changes) {
    return await db.tags.update(id, changes);
  },
  
  // Delete tag
  async deleteTag(id) {
    // check if tag is used in any entries
    const entries = await db.entries
      .filter(entry => entry.tagIds && entry.tagIds.includes(id))
      .toArray();
    
    if (entries.length > 0) {
      // If tag used, remove from all entries
      const updates = entries.map(entry => {
        const updatedTagIds = entry.tagIds.filter(tagId => tagId !== id);
        return db.entries.update(entry.id, { tagIds: updatedTagIds });
      });
      
      await Promise.all(updates);
    }
    
    // Then delete tag
    return await db.tags.delete(id);
  },
  
  // Get tag categories
  getTagCategories() {
    return ['Team', 'Player', 'Custom'];
  }
};

export default tagsService;