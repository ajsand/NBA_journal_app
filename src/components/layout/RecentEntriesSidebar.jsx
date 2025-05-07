import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { db } from '../../db/db';

function RecentEntriesSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const recentEntries = useLiveQuery(() => 
    db.entries
      .orderBy('dateCreated')
      .reverse()
      .limit(10)
      .toArray()
  );

  const handleEntryClick = (entryId) => {
    navigate(`/entries/${entryId}`);
  };

  if (!recentEntries?.length) return null;

  return (
    <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Recent Entries</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {recentEntries.map(entry => (
          <div
            key={entry.id}
            onClick={() => handleEntryClick(entry.id)}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              location.pathname.includes(entry.id.toString())
                ? 'bg-blue-50'
                : ''
            }`}
          >
            <h3 className="font-medium text-gray-900 mb-1">{entry.title}</h3>
            <div className="text-sm text-gray-500">
              {format(new Date(entry.dateCreated), 'MMM d, yyyy')}
            </div>
            <div className="text-sm text-gray-600 line-clamp-2 mt-1">
              {entry.body.replace(/<[^>]*>/g, ' ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentEntriesSidebar