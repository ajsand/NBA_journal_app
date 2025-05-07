import React from 'react';

function TagBadge({ tag, size = 'md', onClick }) {
  // Determine color based on tag category
  const getBackgroundColor = () => {
    switch (tag.category) {
      case 'Team':
        return 'bg-blue-100 text-blue-800';
      case 'Player':
        return 'bg-purple-100 text-purple-800';
      case 'Custom':
      default:
        return 'bg-green-100 text-green-800';
    }
  };
  
  // Determine size classes
  const getSizeClasses = () => {
    return size === 'sm' 
      ? 'px-2 py-0.5 text-xs'
      : 'px-3 py-1 text-sm';
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-md font-medium ${getBackgroundColor()} ${getSizeClasses()} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={onClick}
    >
      {tag.name}
    </span>
  );
}

export default TagBadge;