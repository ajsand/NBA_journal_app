import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { format } from 'date-fns';
import { entriesService } from '../services/entriesService';
import { tagsService } from '../services/tagsService';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import TagBadge from '../components/tags/TagBadge';
import { Plus, X } from 'lucide-react';

function EntryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('Commentary');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagCategory, setNewTagCategory] = useState('Custom');
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  const allTags = useLiveQuery(() => db.tags.toArray());
  
  const entry = useLiveQuery(() => {
    if (isEditMode) {
      return db.entries.get(parseInt(id));
    }
    return null;
  }, [id]);
  
  const selectedTags = useLiveQuery(() => {
    if (selectedTagIds.length === 0) return [];
    return db.tags.where('id').anyOf(selectedTagIds).toArray();
  }, [selectedTagIds]);
  
  useEffect(() => {
    if (isEditMode && entry) {
      setTitle(entry.title || '');
      setBody(entry.body || '');
      setType(entry.type || 'Commentary');
      setDate(format(new Date(entry.dateCreated), 'yyyy-MM-dd'));
      setSelectedTagIds(entry.tagIds || []);
    }
  }, [isEditMode, entry]);
  
  useEffect(() => {
    if (title || body) {
      const timer = setTimeout(() => {
        setIsAutosaving(true);
        setTimeout(() => {
          setIsAutosaving(false);
          setLastSaved(new Date());
        }, 500);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [title, body]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title for your entry');
      return;
    }
    
    const entryData = {
      title,
      body,
      type,
      tagIds: selectedTagIds,
      dateCreated: new Date(date)
    };
    
    try {
      if (isEditMode) {
        await entriesService.updateEntry({
          ...entryData,
          id: parseInt(id)
        });
      } else {
        const newId = await entriesService.createEntry(entryData);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };
  
  const handleTagSelect = (tagId) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };
  
  const createNewTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const newTagId = await tagsService.createTag(newTagName, newTagCategory);
      setSelectedTagIds(prev => [...prev, newTagId]);
      setNewTagName('');
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Failed to create tag. Please try again.');
    }
  };
  
  const tagCategories = ['Team', 'Player', 'Custom'];
  
  const groupedTags = allTags?.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <form id="entry-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Entry Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="Commentary">Commentary</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-xl font-medium border-b border-gray-200 focus:outline-none focus:border-primary-500"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <button
              type="button"
              onClick={() => setShowTagPicker(!showTagPicker)}
              className="text-primary-600 text-sm hover:text-primary-700 focus:outline-none"
            >
              + Add Tag
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-8 mb-2">
            {selectedTags?.map(tag => (
              <div key={tag.id} className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
                <TagBadge tag={tag} size="sm" />
                <button
                  type="button"
                  onClick={() => handleTagSelect(tag.id)}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          
          {showTagPicker && (
            <div className="border border-gray-200 rounded-md mt-2 p-3 bg-white">
              <div className="flex items-center mb-3">
                <input
                  type="text"
                  placeholder="New tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <select
                  value={newTagCategory}
                  onChange={(e) => setNewTagCategory(e.target.value)}
                  className="mx-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {tagCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={createNewTag}
                  disabled={!newTagName.trim()}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
                    newTagName.trim() 
                      ? 'bg-primary-500 text-white hover:bg-primary-600' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </button>
              </div>
              
              <div className="max-h-48 overflow-y-auto">
                {groupedTags && Object.entries(groupedTags).map(([category, tags]) => (
                  <div key={category} className="mb-3">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(tag => (
                        <div 
                          key={tag.id}
                          onClick={() => handleTagSelect(tag.id)}
                          className={`cursor-pointer rounded-md px-2 py-1 text-sm border ${
                            selectedTagIds.includes(tag.id)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <ReactQuill 
            theme="snow" 
            value={body} 
            onChange={setBody}
            placeholder="Start writing here..."
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
              ]
            }}
          />
        </div>
        
        <div className="text-right text-sm text-gray-500 italic">
          {isAutosaving ? (
            <span>Auto-saving...</span>
          ) : lastSaved ? (
            <span>Draft will be auto-saved</span>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default EntryForm;