import { writable, derived } from 'svelte/store';
import { youtubeService } from './youtube.js';
import { storageService } from '../services/storageService.js';
import { STORAGE_KEYS } from '../services/youtubeService.js';

// Playlist state store
export const upcoming = writable([]);

// Initialize playlist from localStorage
const initialUpcoming = storageService.getItem(STORAGE_KEYS.UPCOMING) || [];
upcoming.set(initialUpcoming);

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
    const video = { id, title };
    upcoming.update(currentList => {
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
        youtubeService.playVideo(nextVideo.id, nextVideo.title);
        return currentList.slice(1); // Remove first item
      }
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
  }
};