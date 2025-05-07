import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FixedSizeList as List } from 'react-window';
import TagBadge from '../tags/TagBadge';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';

const EntryRow = memo(({ data, index, style }) => {
  const entry = data.entries[index];
  const navigate = useNavigate();
  const tags = useLiveQuery(() => {
    if (!entry.tagIds) return [];
    return db.tags.where('id').anyOf(entry.tagIds).toArray();
  }, [entry.tagIds]);

  return (
    <div 
      style={style}
      className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
        data.selectedEntryId === entry.id ? 'border-primary-500 bg-blue-50' : 'border-transparent'
      }`}
      onClick={() => navigate(`/entries/${entry.id}`)}
    >
      <h3 className="text-lg font-medium text-gray-900 mb-1">{entry.title}</h3>
      
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <span>{format(new Date(entry.dateCreated), 'MMM d, yyyy')}</span>
        <span className="mx-2">•</span>
        <span>{entry.type}</span>
      </div>
      
      <div className="line-clamp-2 text-sm text-gray-700 mb-2" 
          dangerouslySetInnerHTML={{ __html: entry.body.replace(/<[^>]*>/g, ' ').substring(0, 120) + '...' }} />
      
      <div className="flex flex-wrap gap-2 mt-2">
        {tags?.map(tag => (
          <TagBadge key={tag.id} tag={tag} size="sm" />
        ))}
      </div>
    </div>
  );
});

function EntryList({ entries, selectedEntryId }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No entries found.</p>
      </div>
    );
  }

  return (
    <List
      height={600}
      itemCount={entries.length}
      itemSize={180}
      width="100%"
      itemData={{ entries, selectedEntryId }}
    >
      {EntryRow}
    </List>
  );
}

export default memo(EntryList);