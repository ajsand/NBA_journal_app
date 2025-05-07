import React from 'react';
import { Book, Edit, Tag, Search, Filter } from 'lucide-react';

function Help() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Help & Documentation</h1>
        <p className="text-gray-600 mb-8">Welcome to the NBA Fan Journal application. This guide will help you get started.</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Book className="mr-2 text-primary-500" size={20} />
              Getting Started
            </h2>
            <p className="mb-3">
              NBA Fan Journal is your personal space to record thoughts, analysis, and insights about NBA games, players, and teams. 
              All your entries are stored locally on your computer.
            </p>
            <p>
              The application consists of three main sections:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Dashboard</strong> - Shows your most recent entries</li>
              <li><strong>All Entries</strong> - Lets you browse, search, and filter all your journal entries</li>
              <li><strong>Help</strong> - The documentation you're reading now</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Edit className="mr-2 text-primary-500" size={20} />
              Creating and Editing Entries
            </h2>
            <p className="mb-3">
              To create a new entry, click the "+ New Entry" button in the top right corner of the application. This opens the entry form where you can:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Enter a title for your entry</li>
              <li>Select an entry type (currently only "Commentary" is available)</li>
              <li>Add tags to categorize your entry</li>
              <li>Write your content using the rich text editor</li>
            </ul>
            <p className="mb-3">
              To edit an existing entry, navigate to the entry and click the "Edit" button. Your changes are automatically saved as you type.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-sm">
              <p className="text-blue-700">
                <strong>Tip:</strong> Use tags consistently to make it easier to find related entries later.
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Tag className="mr-2 text-primary-500" size={20} />
              Using Tags
            </h2>
            <p className="mb-3">
              Tags help you organize and categorize your entries. There are three types of tags:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-sm">Team</span> - For NBA teams (Lakers, Celtics, etc.)</li>
              <li><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md text-sm">Player</span> - For individual players (Durant, James, etc.)</li>
              <li><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-md text-sm">Custom</span> - For your own categories (Stats, Games, etc.)</li>
            </ul>
            <p>
              When creating or editing an entry, click "+ Add Tag" to open the tag picker. You can select existing tags or create new ones by entering a name and selecting a category.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Search className="mr-2 text-primary-500" size={20} />
              Searching and Filtering
            </h2>
            <p className="mb-3">
              To find specific entries, you can:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Use the search bar in the header to search by title or content</li>
              <li>Filter by entry type using the tabs in the Dashboard</li>
              <li>In the All Entries view, use the filter bar to filter by type, date range, and tags</li>
              <li>Toggle between grid and list view in the All Entries page</li>
            </ul>
            <p>
              Filters can be combined to narrow down your results. For example, you can search for all entries about the Lakers from the last month that mention specific players.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Help;