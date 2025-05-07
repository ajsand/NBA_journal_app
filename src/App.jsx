import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import RecentEntriesSidebar from './components/layout/RecentEntriesSidebar';
import Dashboard from './pages/Dashboard';
import AllEntries from './pages/AllEntries';
import EntryViewer from './pages/EntryViewer';
import EntryForm from './pages/EntryForm';
import Help from './pages/Help';
import { TagsProvider } from './context/TagsContext';
import { SearchProvider } from './context/SearchContext';

function App() {
  const location = useLocation();
  
  return (
    <SearchProvider>
      <TagsProvider>
        <div className="flex flex-col h-screen bg-gray-50">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/entries" element={<AllEntries />} />
                  <Route path="/entries/:id" element={<EntryViewer />} />
                  <Route path="/new" element={<EntryForm />} />
                  <Route path="/edit/:id" element={<EntryForm />} />
                  <Route path="/help" element={<Help />} />
                </Routes>
              </div>
              <RecentEntriesSidebar />
            </main>
          </div>
        </div>
      </TagsProvider>
    </SearchProvider>
  );
}

export default App;