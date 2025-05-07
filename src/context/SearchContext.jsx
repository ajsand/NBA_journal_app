import React, { createContext, useState, useContext, useCallback } from 'react';
import debounce from 'lodash.debounce';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchText, setSearchText] = useState('');
  
  // Debounced search handler
  const debouncedSetSearch = useCallback(
    debounce((text) => {
      setSearchText(text);
    }, 300),
    []
  );
  
  const handleSearchChange = (e) => {
    debouncedSetSearch(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchText('');
    // Clear search input value
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
      searchInput.value = '';
    }
  };
  
  const value = {
    searchText,
    handleSearchChange,
    clearSearch
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}