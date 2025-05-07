import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { useSearch } from '../context/SearchContext';
import FilterBar from '../components/filters/FilterBar';
import EntryGrid from '../components/entries/EntryGrid';
import EntryList from '../components/entries/EntryList';
import { GridIcon, List } from 'lucide-react';

function AllEntries() {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    type: null,
    dateRange: null,
    tagIds: []
  });
  const [sortBy, setSortBy] = useState('Date Newest');
  const { searchText } = useSearch();
  
  // Get all entries
  const entries = useLiveQuery(() => 
    db.entries.orderBy('dateCreated').reverse().toArray()
  );
  
  // Apply filters
  const filteredEntries = entries
    ?.filter(entry => {
      // Apply type filter
      if (filters.type && filters.type !== 'All Types' && entry.type !== filters.type) {
        return false;
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
        const entryDate = new Date(entry.dateCreated);
        const start = new Date(filters.dateRange.start);
        const end = new Date(filters.dateRange.end);
        end.setHours(23, 59, 59, 999); 
        
        if (entryDate < start || entryDate > end) {
          return false;
        }
      }
      
      // Apply tag filter
      if (filters.tagIds && filters.tagIds.length > 0) {
        if (!entry.tagIds || !entry.tagIds.some(id => filters.tagIds.includes(id))) {
          return false;
        }
      }
      
      // Apply search filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const titleMatch = entry.title.toLowerCase().includes(searchLower);
        const bodyMatch = entry.body.toLowerCase().includes(searchLower);
        return titleMatch || bodyMatch;
      }
      
      return true;
    })
    // Apply sorting
    .sort((a, b) => {
      if (sortBy === 'Date Newest') {
        return new Date(b.dateCreated) - new Date(a.dateCreated);
      } else if (sortBy === 'Date Oldest') {
        return new Date(a.dateCreated) - new Date(b.dateCreated);
      } else if (sortBy === 'Title A-Z') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const clearFilters = () => {
    setFilters({
      type: null,
      dateRange: null,
      tagIds: []
    });
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">All Entries</h1>
          <p className="text-gray-500">Browse and filter all your journal entries</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="Date Newest">Date Newest</option>
              <option value="Date Oldest">Date Oldest</option>
              <option value="Title A-Z">Title A-Z</option>
              <option value="Title Z-A">Title Z-A</option>
            </select>
          </div>
          
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <GridIcon size={18} />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <FilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      
      {filteredEntries && (
        <div>
          <div className="text-sm text-gray-500 mb-2">
            Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </div>
          
          {viewMode === 'grid' 
            ? <EntryGrid entries={filteredEntries} /> 
            : <EntryList entries={filteredEntries} />
          }
        </div>
      )}
    </div>
  );
}

export default AllEntries;