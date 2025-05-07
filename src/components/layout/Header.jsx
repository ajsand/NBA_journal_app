import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBasket as Basketball, PlusCircle } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

function Header() {
  const { handleSearchChange } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if in entry form (new/edit)
  const isEntryForm = location.pathname === '/new' || location.pathname.includes('/edit');
  
  // For entry form, show different buttons (Save/Cancel)
  const renderRightSide = () => {
    if (isEntryForm) {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center"
          >
            <span className="mr-1">✕</span> Cancel
          </button>
          <button
            type="submit"
            form="entry-form"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none flex items-center"
          >
            Save
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/new')}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none flex items-center"
        >
          <PlusCircle size={18} className="mr-2" />
          New Entry
        </button>
      </div>
    );
  };
  
  return (
    <header className="h-header flex items-center justify-between px-4 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center">
        <Link to="/" className="flex items-center text-primary-600 font-bold text-xl mr-8">
          <Basketball size={24} className="mr-2" />
          NBA Fan Journal
        </Link>
        
        {!isEntryForm && (
          <div className="relative max-w-md">
            <input
              type="search"
              placeholder="Search entries..."
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {renderRightSide()}
    </header>
  );
}

export default Header;