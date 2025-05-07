import React, { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { tagsService } from '../../services/tagsService';
import TagBadge from './TagBadge';
import { X, ChevronDown, Trash2 } from 'lucide-react';

function TagsDropdown({ selectedTagIds, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const dropdownRef = useRef(null);
  
  // Get all tags from db
  const tags = useLiveQuery(() => db.tags.toArray());
  
  // Filter tags based on search text
  const filteredTags = tags?.filter(tag => 
    tag.name.toLowerCase().includes(searchText.toLowerCase())
  );
  
  // Group tags by category
  const groupedTags = filteredTags?.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});
  
  // Get selected tags for display
  const selectedTags = tags?.filter(tag => selectedTagIds.includes(tag.id)) || [];
  
  // Handle tag selection
  const handleTagSelect = (tagId) => {
    const newSelection = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    
    onChange(newSelection);
  };

    // Handle tag deletion
    const handleDeleteTag = async (tagId) => {
      try {
        await tagsService.deleteTag(tagId);
        if (selectedTagIds.includes(tagId)) {
          onChange(selectedTagIds.filter(id => id !== tagId));
        }
        setShowDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Failed to delete tag. Please try again.');
      }
    };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-56 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
      >
        <span className="truncate mr-1">
          {selectedTags.length > 0 
            ? `${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''} selected` 
            : 'Select tags...'}
        </span>
        <ChevronDown size={16} className="ml-auto" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-72 bg-white shadow-lg rounded-md border border-gray-200">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search tags..."
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          
          <div className="max-h-64 overflow-y-auto p-2">
            {groupedTags && Object.keys(groupedTags).length > 0 ? (
              Object.entries(groupedTags).map(([category, categoryTags]) => (
                <div key={category} className="mb-2">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 px-2">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-1 px-1">
                    {categoryTags.map(tag => (
                      <div 
                        key={tag.id}
                        className={`group flex items-center justify-between rounded-md px-2 py-1 text-sm border ${
                          selectedTagIds.includes(tag.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span 
                          onClick={() => handleTagSelect(tag.id)}
                          className="cursor-pointer"
                        >
                          {tag.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(tag.id);
                          }}
                          className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-gray-500">
                {tags?.length === 0 ? 'No tags available.' : 'No matching tags found.'}
              </div>
            )}
          </div>
          
          {selectedTags.length > 0 && (
            <div className="border-t border-gray-200 p-2">
              <h4 className="text-xs font-medium text-gray-500 mb-1 px-1">Selected:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map(tag => (
                  <div 
                    key={tag.id}
                    className="flex items-center bg-primary-100 text-primary-700 rounded-md px-2 py-0.5 text-sm"
                  >
                    <span>{tag.name}</span>
                    <X 
                      size={14} 
                      className="ml-1 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagSelect(tag.id);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Tag</h3>
            <p className="mb-6">Are you sure you want to delete this tag? It will be removed from all entries that use it.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTag(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TagsDropdown;