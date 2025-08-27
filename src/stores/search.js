import { writable, derived } from 'svelte/store';
import { searchService } from '../services/searchService.js';

// Search state store
export const searchState = writable({
  query: '',
  results: [],
  isSearching: false,
  error: null
});

// Individual stores for easier access
export const searchQuery = writable('');
export const searchResults = writable([]);
export const isSearching = writable(false);
export const searchError = writable(null);

// Derived store for whether we have results
export const hasSearchResults = derived(
  searchResults,
  $results => $results && $results.length > 0
);

// Sync individual stores with main state
searchQuery.subscribe(query => {
  searchState.update(state => ({ ...state, query }));
});

searchResults.subscribe(results => {
  searchState.update(state => ({ ...state, results }));
});

isSearching.subscribe(searching => {
  searchState.update(state => ({ ...state, isSearching: searching }));
});

searchError.subscribe(error => {
  searchState.update(state => ({ ...state, error }));
});

// Search actions
export const searchActions = {
  async performSearch(query) {
    if (!query || !query.trim()) {
      searchError.set('Search query is required');
      return;
    }

    try {
      isSearching.set(true);
      searchError.set(null);
      searchQuery.set(query.trim());
      
      console.log('Searching for:', query.trim());
      const results = await searchService.searchVideos(query.trim());
      
      searchResults.set(results);
      console.log('Search completed. Found', results.length, 'results');
      
    } catch (error) {
      console.error('Search error:', error);
      searchError.set(error.message || 'Search failed');
      searchResults.set([]);
    } finally {
      isSearching.set(false);
    }
  },

  clearSearch() {
    searchQuery.set('');
    searchResults.set([]);
    searchError.set(null);
  },

  clearError() {
    searchError.set(null);
  }
};