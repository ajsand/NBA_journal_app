import React from 'react';
import EntryCard from './EntryCard';

function EntryGrid({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No entries found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

export default EntryGrid;