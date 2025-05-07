import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit, Trash2, Eye } from 'lucide-react';
import { entriesService } from '../services/entriesService';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import TagBadge from '../components/tags/TagBadge';

function EntryViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Get entry from database
  const entry = useLiveQuery(() => 
    db.entries.get(parseInt(id)),
    [id]
  );
  
  // Get tags for entry
  const tags = useLiveQuery(() => {
    if (!entry?.tagIds) return [];
    return db.tags.where('id').anyOf(entry.tagIds).toArray();
  }, [entry?.tagIds]);
  
  // Redirect if entry not found
  useEffect(() => {
    if (entry === undefined) {
    } else if (entry === null) {
      navigate('/');
    }
  }, [entry, navigate]);
  
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };
  
  const handleDelete = async () => {
    await entriesService.deleteEntry(parseInt(id));
    navigate('/');
  };
  
  if (!entry) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium mr-2">
              {entry.type}
            </div>
            <div className="text-gray-500 text-sm">
              {format(new Date(entry.dateCreated), 'MMM d, yyyy, h:mm a')}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm"
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md bg-white hover:bg-red-50 text-sm"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map(tag => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
        
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: entry.body }} />
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-gray-500 text-sm flex items-center justify-between">
          <div>
            Created: {format(new Date(entry.dateCreated), 'MMM d, yyyy, h:mm a')}
          </div>
          <div className="flex items-center">
            <Eye size={16} className="mr-1" />
            Viewing
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Entry</h3>
            <p className="mb-6">Are you sure you want to delete this entry? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default EntryViewer;