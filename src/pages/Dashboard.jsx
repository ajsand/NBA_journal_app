import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { useSearch } from '../context/SearchContext';
import EntryList from '../components/entries/EntryList';

function Dashboard() {
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sortBy, setSortBy] = useState('Date Newest');
  const { searchText } = useSearch();
  
  // Get entries from database
  const entries = useLiveQuery(() => 
    db.entries.orderBy('dateCreated').reverse().toArray()
  );
  
  // Apply filters
  const filteredEntries = entries
    ?.filter(entry => {
      // Apply type filter
      if (typeFilter !== 'All Types' && entry.type !== typeFilter) {
        return false;
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
  
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your NBA Journal</h2>
        <p className="text-gray-600">Create and collect your thoughts, analysis, and memories as you follow the NBA. Your personal basketball journey starts here.</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Recent Entries</h1>
        
        <div className="flex items-center space-x-2">
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
        </div>
      </div>
      
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 rounded-md text-sm mr-2 ${
            typeFilter === 'All Types' ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setTypeFilter('All Types')}
        >
          All Types
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm ${
            typeFilter === 'Commentary' ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setTypeFilter('Commentary')}
        >
          Commentary
        </button>
      </div>
      
      {/* Entries List */}
      {filteredEntries && (
        <EntryList entries={filteredEntries} />
      )}
    </div>
  );
}

export default Dashboard;