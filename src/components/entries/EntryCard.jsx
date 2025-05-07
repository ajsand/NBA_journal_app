import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import TagBadge from '../tags/TagBadge';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';

function EntryCard({ entry }) {
  const navigate = useNavigate();
  const tags = useLiveQuery(() => {
    if (!entry.tagIds) return [];
    return db.tags.where('id').anyOf(entry.tagIds).toArray();
  }, [entry.tagIds]);

  const handleClick = () => {
    navigate(`/entries/${entry.id}`);
  };

  // Format body text 
  const getBodyPreview = () => {
    const strippedHtml = entry.body.replace(/<[^>]*>/g, ' ');
    return strippedHtml.length > 120 
      ? strippedHtml.substring(0, 120) + '...' 
      : strippedHtml;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2">
            {entry.type}
          </span>
          <span>{format(new Date(entry.dateCreated), 'MMM d, yyyy')}</span>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">{entry.title}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {getBodyPreview()}
        </p>
        
        <div className="flex flex-wrap gap-1.5">
          {tags && tags.map(tag => (
            <TagBadge key={tag.id} tag={tag} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EntryCard;