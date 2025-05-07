import React, { createContext, useState, useContext } from 'react';
import { tagsService } from '../services/tagsService';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

const TagsContext = createContext();

export function TagsProvider({ children }) {
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Get data from database
  const tags = useLiveQuery(() => db.tags.toArray());
  
  const addTag = async (name, category) => {
    return await tagsService.createTag(name, category || 'Custom');
  };
  
  const removeTag = async (id) => {
    await tagsService.deleteTag(id);
    // Remove from selected tags if present
    setSelectedTags(prev => prev.filter(tagId => tagId !== id));
  };
  
  const selectTag = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };
  
  const clearSelectedTags = () => {
    setSelectedTags([]);
  };
  
  const getTagsByCategory = (category) => {
    if (!tags) return [];
    return tags.filter(tag => tag.category === category);
  };
  
  const value = {
    tags,
    selectedTags,
    addTag,
    removeTag,
    selectTag,
    clearSelectedTags,
    getTagsByCategory,
  };
  
  return (
    <TagsContext.Provider value={value}>
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
}