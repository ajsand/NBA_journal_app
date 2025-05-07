import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Archive, HelpCircle, Edit } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';

function Sidebar() {
  // Get count of entries by type
  const commentaryCount = useLiveQuery(() => 
    db.entries.where('type').equals('Commentary').count()
  ) || 0;
  
  return (
    <aside className="w-sidebar bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 px-2 pt-4">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 text-gray-700 rounded-md ${
                  isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-100'
                }`
              }
            >
              <Home size={20} className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/entries" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 text-gray-700 rounded-md ${
                  isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-100'
                }`
              }
            >
              <Archive size={20} className="mr-3" />
              All Entries
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/help" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 text-gray-700 rounded-md ${
                  isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-100'
                }`
              }
            >
              <HelpCircle size={20} className="mr-3" />
              Help
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <h3 className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-2">
          Entry Types
        </h3>
        <ul className="space-y-1">
          <li>
            <div className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
              <Edit size={18} className="mr-3 text-gray-500" />
              <span>Commentary</span>
              <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {commentaryCount}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;