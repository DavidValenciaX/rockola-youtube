# Rockola YouTube - Migration from AngularJS to Svelte - Action Plan

## Project Overview
This document outlines the complete action plan to refactor the Rockola YouTube application from the deprecated AngularJS framework to modern Svelte. The application is a web-based music player that uses YouTube's Iframe API for playback and includes search functionality via a backend proxy.

## Current Architecture Analysis

### Technologies to Replace
- **AngularJS 1.x** → **Svelte 4.x**
- **angular-local-storage.js** → **Svelte stores + localStorage**
- **Traditional DOM manipulation** → **Svelte reactive components**

### Technologies to Maintain
- **Express.js backend** (server.js) - No changes needed
- **YouTube Iframe API** - Keep existing integration
- **CSS styling** - Migrate with minimal changes
- **Package.json dependencies** - Update build tools only

## Phase 1: Project Setup and Environment Preparation

### 1.1 Initialize Svelte Project Structure
- [ ] Install Svelte development dependencies
  - `npm install -D svelte@4 @sveltejs/vite-plugin-svelte vite`
  - `npm install -D @sveltejs/adapter-static` (for static build)
- [ ] Create `vite.config.js` configuration file
- [ ] Create `svelte.config.js` configuration file
- [ ] Update `package.json` scripts for Svelte development
- [ ] Create `src/` directory structure
- [ ] Setup build output to maintain compatibility with Express server

### 1.2 Project Structure Setup
- [ ] Create directory structure:
  ```
  src/
  ├── App.svelte (main component)
  ├── components/
  │   ├── Header.svelte
  │   ├── SearchForm.svelte
  │   ├── YoutubePlayer.svelte
  │   ├── SearchResults.svelte
  │   ├── CurrentVideoInfo.svelte
  │   └── Playlist.svelte
  ├── stores/
  │   ├── youtube.js
  │   ├── search.js
  │   └── playlist.js
  ├── services/
  │   ├── youtubeService.js
  │   ├── searchService.js
  │   └── storageService.js
  └── main.js (entry point)
  ```

### 1.3 Development Environment Configuration
- [ ] Configure Vite for development server
- [ ] Setup build process to output to `dist/` or maintain current structure
- [ ] Configure development proxy for API calls to Express server
- [ ] Test basic Svelte app compilation

## Phase 2: Core Services Migration

### 2.1 Storage Service (localStorage replacement)
- [ ] Create `src/services/storageService.js`
  - Implement `setItem()`, `getItem()`, `removeItem()` functions
  - Add prefix support (current: 'ls.')
  - Handle JSON serialization/deserialization
  - Add error handling for storage operations
  
### 2.2 YouTube Service Migration
- [ ] Create `src/services/youtubeService.js`
  - Migrate YouTube Iframe API initialization
  - Implement player creation and event handling
  - Port playback control functions (play, pause, playNext)
  - Migrate video progress tracking
  - Handle player state management
  - Implement queue management functions

### 2.3 Search Service Migration  
- [ ] Create `src/services/searchService.js`
  - Implement search API calls to Express backend
  - Handle search result processing
  - Add error handling and retry logic
  - Maintain compatibility with existing `/api/search` endpoint

## Phase 3: Svelte Stores Implementation

### 3.1 YouTube Store (`src/stores/youtube.js`)
- [ ] Create reactive store for YouTube player state:
  - `playerReady`: boolean
  - `currentVideo`: {id, title}
  - `playerState`: 'stopped'|'playing'|'paused'|'buffering'|'ended'
  - `currentTime`: number
  - `duration`: number
  - `progress`: number

### 3.2 Search Store (`src/stores/search.js`)
- [ ] Create reactive store for search functionality:
  - `searchQuery`: string
  - `searchResults`: array
  - `isSearching`: boolean
  - `searchError`: string|null

### 3.3 Playlist Store (`src/stores/playlist.js`)
- [ ] Create reactive store for playlist management:
  - `upcoming`: array of videos
  - `history`: array of played videos
  - Implement methods for add/remove operations
  - Add localStorage persistence

## Phase 4: Component Development

### 4.1 Main App Component (`src/App.svelte`)
- [ ] Create main application shell
- [ ] Setup global styles and layout
- [ ] Implement component composition
- [ ] Handle global error states

### 4.2 Header Component (`src/components/Header.svelte`)
- [ ] Migrate header HTML structure
- [ ] Implement title display
- [ ] Add responsive design

### 4.3 Search Form Component (`src/components/SearchForm.svelte`)
- [ ] Create search input form
- [ ] Implement search submission handling
- [ ] Add form validation
- [ ] Connect to search store

### 4.4 YouTube Player Component (`src/components/YoutubePlayer.svelte`)
- [ ] Create YouTube player container
- [ ] Implement Iframe API integration
- [ ] Handle player events and state updates
- [ ] Add player control buttons
- [ ] Connect to YouTube store

### 4.5 Search Results Component (`src/components/SearchResults.svelte`)
- [ ] Display search results in grid/list format
- [ ] Implement video selection handling
- [ ] Add thumbnail display
- [ ] Handle click events for queueing/playing

### 4.6 Current Video Info Component (`src/components/CurrentVideoInfo.svelte`)
- [ ] Display current playing video information
- [ ] Show playback progress
- [ ] Add time formatting
- [ ] Implement play/pause controls

### 4.7 Playlist Component (`src/components/Playlist.svelte`)
- [ ] Display upcoming videos queue
- [ ] Implement drag-and-drop reordering (optional enhancement)
- [ ] Add delete functionality for queue items
- [ ] Show queue position and next-to-play indication

## Phase 5: YouTube Iframe API Integration

### 5.1 API Loading and Initialization
- [ ] Implement dynamic script loading for YouTube Iframe API
- [ ] Handle `onYouTubeIframeAPIReady` callback
- [ ] Create player instance with proper configuration
- [ ] Set up event listeners for player state changes

### 5.2 Player Control Implementation
- [ ] Implement play/pause functionality
- [ ] Add next/previous video controls
- [ ] Handle video loading and buffering states
- [ ] Implement progress tracking and time updates
- [ ] Add volume control (optional enhancement)

### 5.3 Playlist Management Integration
- [ ] Connect player to playlist store
- [ ] Implement auto-advance to next video
- [ ] Handle end-of-playlist scenarios
- [ ] Add shuffle/repeat functionality (optional enhancement)

## Phase 6: State Management and Data Flow

### 6.1 Reactive Data Flow Implementation
- [ ] Connect all components to appropriate stores
- [ ] Implement derived stores for computed values
- [ ] Add store subscriptions and cleanup
- [ ] Handle asynchronous operations properly

### 6.2 Local Storage Integration
- [ ] Implement automatic playlist persistence
- [ ] Save/restore current video state
- [ ] Add settings persistence (optional)
- [ ] Handle storage errors gracefully

### 6.3 Cross-Component Communication
- [ ] Implement event system for component communication
- [ ] Add global notifications for user feedback
- [ ] Handle loading and error states consistently

## Phase 7: Styling and UI Migration

### 7.1 CSS Migration
- [ ] Migrate existing `style.css` to Svelte component styles
- [ ] Convert global styles to `:global()` selectors where needed
- [ ] Implement scoped component styling
- [ ] Maintain existing visual design and responsiveness

### 7.2 Responsive Design
- [ ] Test and adjust responsive breakpoints
- [ ] Ensure mobile compatibility
- [ ] Add touch-friendly controls
- [ ] Test on various screen sizes

### 7.3 Animations and Transitions
- [ ] Add Svelte transitions for smooth UX
- [ ] Implement loading animations
- [ ] Add hover effects and visual feedback
- [ ] Consider micro-interactions for better UX

## Phase 8: Build System and Production Setup

### 8.1 Build Configuration
- [ ] Configure Vite build for production
- [ ] Setup static asset handling
- [ ] Configure build output directory
- [ ] Ensure compatibility with Express server

### 8.2 Development Workflow
- [ ] Update npm scripts in package.json:
  - `npm run dev` - Start Svelte dev server + Express server
  - `npm run build` - Build for production
  - `npm run preview` - Preview production build
  - `npm start` - Start production server (keep existing)

### 8.3 Express Server Integration
- [ ] Modify Express server to serve Svelte build output
- [ ] Ensure API endpoints remain functional
- [ ] Test development proxy configuration
- [ ] Add fallback routing for SPA support

## Phase 9: Testing and Validation

### 9.1 Functionality Testing
- [ ] Test YouTube player integration
- [ ] Verify search functionality
- [ ] Test playlist management operations
- [ ] Validate localStorage persistence
- [ ] Test responsive design on multiple devices

### 9.2 Cross-Browser Compatibility
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Verify YouTube Iframe API compatibility
- [ ] Test localStorage functionality across browsers
- [ ] Validate CORS handling

### 9.3 Error Handling
- [ ] Test network error scenarios
- [ ] Verify graceful degradation when YouTube is unavailable
- [ ] Test storage quota exceeded scenarios
- [ ] Validate user input handling

## Phase 10: Migration and Cleanup

### 10.1 File Migration and Cleanup
- [ ] Remove AngularJS files:
  - `angular.min.js`
  - `angular-local-storage.js`
  - `app.js` (after migration)
- [ ] Update `index.html` to load Svelte bundle
- [ ] Clean up unused CSS classes and IDs
- [ ] Remove AngularJS-specific attributes from HTML

### 10.2 Documentation Updates
- [ ] Update README.md with new build instructions
- [ ] Document new development workflow
- [ ] Add component documentation
- [ ] Update deployment instructions

### 10.3 Performance Optimization
- [ ] Optimize bundle size
- [ ] Implement code splitting if beneficial
- [ ] Add service worker for caching (optional)
- [ ] Optimize YouTube player loading

## Phase 11: Optional Enhancements

### 11.1 Modern Features
- [ ] Add keyboard shortcuts for player control
- [ ] Implement dark/light theme toggle
- [ ] Add fullscreen mode support
- [ ] Implement playlist export/import

### 11.2 Progressive Web App Features
- [ ] Add PWA manifest
- [ ] Implement service worker for offline functionality
- [ ] Add install prompt
- [ ] Support media session API for system media controls

### 11.3 User Experience Improvements
- [ ] Add drag-and-drop playlist reordering
- [ ] Implement search history
- [ ] Add video duration display in search results
- [ ] Implement loop and shuffle modes

## Risk Assessment and Mitigation

### High Risk Items
1. **YouTube Iframe API Integration** - Critical for core functionality
   - Mitigation: Thorough testing and maintaining exact API compatibility
   
2. **Search Functionality** - Depends on server-side proxy
   - Mitigation: Ensure Express server remains unchanged and functional
   
3. **Local Storage Data Migration** - User data preservation
   - Mitigation: Implement data migration script to preserve existing playlists

### Medium Risk Items
1. **Responsive Design Changes** - Layout might break on some devices
   - Mitigation: Extensive cross-device testing
   
2. **Browser Compatibility** - Svelte might not work on older browsers
   - Mitigation: Check browser support requirements and add polyfills if needed

## Success Criteria

### Functional Requirements
- [ ] All existing features work identically to AngularJS version
- [ ] Search functionality remains fully functional
- [ ] YouTube playback works without issues
- [ ] Playlist management preserves all current capabilities
- [ ] Local storage data persists correctly

### Non-Functional Requirements
- [ ] Application loads faster than AngularJS version
- [ ] Bundle size is smaller than current dependencies
- [ ] Development build time is improved
- [ ] Code maintainability is significantly improved
- [ ] Modern development tooling is available

### User Experience Requirements
- [ ] No breaking changes to user interface
- [ ] All existing keyboard shortcuts work
- [ ] Responsive design is maintained or improved
- [ ] Loading states and error handling are preserved

## Timeline Estimation

- **Phase 1-2 (Setup & Services)**: 3-5 days
- **Phase 3-4 (Stores & Components)**: 5-7 days  
- **Phase 5-6 (YouTube API & State)**: 4-6 days
- **Phase 7 (Styling)**: 2-3 days
- **Phase 8 (Build System)**: 2-3 days
- **Phase 9 (Testing)**: 3-4 days
- **Phase 10-11 (Cleanup & Enhancement)**: 2-4 days

**Total Estimated Time**: 21-32 days

## Notes and Considerations

1. **Backward Compatibility**: Ensure the Express server remains functional throughout migration
2. **Data Preservation**: Existing user playlists in localStorage must be preserved
3. **Progressive Migration**: Consider implementing feature by feature rather than all at once
4. **Testing Strategy**: Each phase should be tested before proceeding to the next
5. **Rollback Plan**: Keep AngularJS version available until Svelte version is fully validated

This migration plan provides a comprehensive roadmap for successfully transitioning from AngularJS to Svelte while maintaining all existing functionality and improving the development experience.