import { writable, derived } from 'svelte/store';
import { youtubeService } from './youtube.js';
import { storageService } from '../services/storageService.js';
import { STORAGE_KEYS, setPlaylistActions } from '../services/youtubeService.js';

// Playlist state store
export const upcoming = writable([]);

// Initialize playlist from localStorage
const initialUpcoming = storageService.getItem(STORAGE_KEYS.UPCOMING) || [];

// Clean up any duplicates that might exist in localStorage
const cleanedUpcoming = [];
const seenIds = new Set();
for (const video of initialUpcoming) {
  if (!seenIds.has(video.id)) {
    seenIds.add(video.id);
    // Add timestamp if missing for better key uniqueness
    cleanedUpcoming.push({
      ...video,
      timestamp: video.timestamp || Date.now() + Math.random()
    });
  }
}

// Update localStorage if we removed duplicates
if (cleanedUpcoming.length !== initialUpcoming.length) {
  console.log(`Cleaned up ${initialUpcoming.length - cleanedUpcoming.length} duplicate videos from playlist`);
  storageService.setItem(STORAGE_KEYS.UPCOMING, cleanedUpcoming);
}

upcoming.set(cleanedUpcoming);

// Derived stores for playlist information
export const hasUpcomingVideos = derived(
  upcoming,
  $upcoming => $upcoming && $upcoming.length > 0
);

export const upcomingCount = derived(
  upcoming,
  $upcoming => $upcoming ? $upcoming.length : 0
);

export const nextVideo = derived(
  upcoming,
  $upcoming => $upcoming && $upcoming.length > 0 ? $upcoming[0] : null
);

// Subscribe to changes and persist to localStorage
upcoming.subscribe(upcomingList => {
  storageService.setItem(STORAGE_KEYS.UPCOMING, upcomingList);
});

// Playlist actions
export const playlistActions = {
  addVideo(id, title) {
    const video = { id, title, timestamp: Date.now() };
    
    // Check if the video is currently playing
    const currentState = youtubeService.getState();
    if (currentState.videoId === id && currentState.playerState !== 'ended') {
      console.log('Video is currently playing, cannot add to queue:', title);
      return null; // Return null to indicate the video was not added
    }
    
    upcoming.update(currentList => {
      // Check for duplicates to prevent key conflicts
      const existsAlready = currentList.some(existingVideo => existingVideo.id === id);
      if (existsAlready) {
        console.log('Video already in queue:', title);
        return currentList;
      }
      
      const newList = [...currentList, video];
      console.log('Queued:', title);
      return newList;
    });
    return video;
  },

  removeVideo(id) {
    upcoming.update(currentList => {
      const newList = currentList.filter(video => video.id !== id);
      console.log('Removed video from queue:', id);
      return newList;
    });
  },

  moveVideo(fromIndex, toIndex) {
    upcoming.update(currentList => {
      const newList = [...currentList];
      const [movedItem] = newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, movedItem);
      return newList;
    });
  },

  clearPlaylist() {
    upcoming.set([]);
    console.log('Playlist cleared');
  },

  playNext() {
    upcoming.update(currentList => {
      if (currentList.length > 0) {
        const nextVideo = currentList[0];
        // Get the YouTube service instance and play the video
        const ytService = youtubeService;
        ytService.playVideo(nextVideo.id, nextVideo.title);
        
        console.log('Playing next video:', nextVideo.title);
        return currentList.slice(1); // Remove first item
      }
      console.log('No videos in queue to play next');
      return currentList;
    });
  },

  startPlaylist() {
    const currentUpcoming = youtubeService.getUpcoming();
    if (currentUpcoming.length > 0) {
      youtubeService.playNext();
      console.log('Started playlist from beginning');
    }
  },

  getItemClass(index) {
    return index === 0 ? 'next-to-play' : '';
  },

  // Method to get current upcoming list (for YouTube service to access)
  getUpcoming() {
    return storageService.getItem(STORAGE_KEYS.UPCOMING) || [];
  }
};

// Set up the playlist actions reference in the YouTube service
setPlaylistActions(playlistActions);