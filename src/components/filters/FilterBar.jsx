import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import DateRangePicker from './DateRangePicker';
import TagsDropdown from '../tags/TagsDropdown';

function FilterBar({ filters, onFilterChange, onClearFilters }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const entryTypes = useLiveQuery(() => {
    return db.entries
      .orderBy('type')
      .uniqueKeys();
  });
  
  const handleTypeChange = (event) => {
    onFilterChange({ ...filters, type: event.target.value });
  };
  
  const handleDateRangeChange = (range) => {
    onFilterChange({ ...filters, dateRange: range });
    setShowDatePicker(false);
  };
  
  const handleTagsChange = (selectedTagIds) => {
    onFilterChange({ ...filters, tagIds: selectedTagIds });
  };
  
  // Format date range 
  const formatDateRangeDisplay = () => {
    if (!filters.dateRange || !filters.dateRange.start || !filters.dateRange.end) {
      return 'Select dates...';
    }
    
    const start = new Date(filters.dateRange.start);
    const end = new Date(filters.dateRange.end);
    
    return `${start.getMonth() + 1}/${start.getDate()}/${start.getFullYear()} - ${end.getMonth() + 1}/${end.getDate()}/${end.getFullYear()}`;
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by type:</label>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${
                !filters.type || filters.type === 'All Types' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onFilterChange({ ...filters, type: 'All Types' })}
            >
              All Types
            </button>
            
            {entryTypes?.map(type => (
              <button 
                key={type}
                className={`px-3 py-1 rounded-md text-sm ${
                  filters.type === type 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onFilterChange({ ...filters, type })}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range:</label>
          <div className="relative">
            <button
              className="flex items-center w-56 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
              {formatDateRangeDisplay()}
            </button>
            
            {showDatePicker && (
              <div className="absolute mt-1 z-10">
                <DateRangePicker 
                  selectedRange={filters.dateRange} 
                  onChange={handleDateRangeChange}
                  onClose={() => setShowDatePicker(false)}
                />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags:</label>
          <TagsDropdown 
            selectedTagIds={filters.tagIds || []} 
            onChange={handleTagsChange}
          />
        </div>
        
        <div className="ml-auto">
          <button
            onClick={onClearFilters}
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
          >
            <X size={16} className="mr-1" />
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Active filters display */}
      {(filters.type || filters.dateRange || (filters.tagIds && filters.tagIds.length > 0)) && (
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">Active filters:</span>
          {filters.type && filters.type !== 'All Types' && (
            <span className="bg-gray-100 px-2 py-1 rounded-md mr-2">
              Type: {filters.type}
            </span>
          )}
          {filters.dateRange && filters.dateRange.start && filters.dateRange.end && (
            <span className="bg-gray-100 px-2 py-1 rounded-md mr-2">
              Date: {formatDateRangeDisplay()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterBar;