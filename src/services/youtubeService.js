import { storageService } from './storageService.js';

// Storage keys constants
export const STORAGE_KEYS = {
  UPCOMING: 'upcoming',
  CURRENT_VIDEO: 'current_video',
  CONTROLS_ENABLED: 'controls_enabled'
};

// Import playlist actions - will be set by the store initialization
let playlistStoreActions = null;

// Function to set playlist actions reference
export function setPlaylistActions(actions) {
  playlistStoreActions = actions;
}

// YouTube service to handle player functionality
export class YouTubeService {
  constructor() {
    this.player = null;
    this.ready = false;
    this.apiLoaded = false;
    this.pendingPlay = null;
    this.createPlayerRetries = 0;
    this.isRecreating = false; // Flag to track recreation state
    
    // Player state
    this.state = {
      videoId: null,
      videoTitle: null,
      playerState: 'stopped',
      currentTime: 0,
      duration: 0,
      controlsEnabled: storageService.getItem(STORAGE_KEYS.CONTROLS_ENABLED) ?? true
    };

    // Callbacks for state changes
    this.stateChangeCallbacks = [];
    this.progressCallbacks = [];

    this.loadYouTubeAPI();
  }

  // Load YouTube Iframe API
  loadYouTubeAPI() {
    if (this.apiLoaded) return;
    
    if (window.YT?.Player) {
      this.apiLoaded = true;
      this.ready = true;
      this.createPlayer();
      return;
    }

    // Set up global callback
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube Iframe API is ready');
      this.apiLoaded = true;
      this.ready = true;
      this.createPlayer();
      this.notifyStateChange();
    };

    // Load the API script if not already loaded
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  // Create YouTube player
  createPlayer() {
    if (!this.ready || this.player) return;
    
    const playerElement = document.getElementById('youtube-player');
    if (!playerElement) {
      // Only retry a few times to avoid spam
      if (!this.createPlayerRetries) this.createPlayerRetries = 0;
      if (this.createPlayerRetries < 20) { // Max 20 retries (2 seconds)
        this.createPlayerRetries++;
        setTimeout(() => this.createPlayer(), 100);
      } else {
        console.error('YouTube player element not found after multiple retries');
      }
      return;
    }

    console.log('Creating YouTube player...');
    this.player = new YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      playerVars: {
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        fs: 1,
        cc_load_policy: 0,
        iv_load_policy: 3,
        autohide: 0,
        controls: this.state.controlsEnabled ? 1 : 0
      },
      events: {
        'onReady': (event) => this.onPlayerReady(event),
        'onStateChange': (event) => this.onPlayerStateChange(event)
      }
    });
  }

  // Player event handlers
  onPlayerReady(event) {
    console.log('YouTube Player is ready');
    
    // If there's a pending play request, execute it
    if (this.pendingPlay?.id) {
      try {
        this.player.loadVideoById(this.pendingPlay.id);
        this.state.videoId = this.pendingPlay.id;
        this.state.videoTitle = this.pendingPlay.title;
        this.state.playerState = 'playing';
        storageService.setItem(STORAGE_KEYS.CURRENT_VIDEO, { 
          id: this.pendingPlay.id, 
          title: this.pendingPlay.title 
        });
      } catch (e) {
        console.warn('Could not start pending playback:', e);
      } finally {
        this.pendingPlay = null;
      }
      this.notifyStateChange();
      return;
    }

    // Restore current video if exists
    const current = storageService.getItem(STORAGE_KEYS.CURRENT_VIDEO);
    if (current?.id) {
      try {
        this.player.cueVideoById(current.id);
        this.state.videoId = current.id;
        this.state.videoTitle = current.title;
        this.state.playerState = 'paused';
      } catch (e) {
        console.warn('Could not restore current video:', e);
      }
      this.notifyStateChange();
    }
  }

  onPlayerStateChange(event) {
    const previousState = this.state.playerState;
    
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.state.playerState = 'playing';
        console.log('Video playing');
        this.startProgressTracking();
        break;
      case YT.PlayerState.PAUSED:
        this.state.playerState = 'paused';
        console.log('Video paused');
        this.stopProgressTracking();
        break;
      case YT.PlayerState.ENDED:
        this.state.playerState = 'ended';
        console.log('🎬 Video ended - Playing next...');
        this.stopProgressTracking();
        // Clear current video from storage when ended
        storageService.removeItem(STORAGE_KEYS.CURRENT_VIDEO);
        this.playNext();
        break;
      case YT.PlayerState.BUFFERING:
        this.state.playerState = 'buffering';
        console.log('Video buffering...');
        break;
      case YT.PlayerState.CUED:
        // Video is cued (loaded but not playing)
        this.state.playerState = 'paused';
        console.log('Video cued (ready to play)');
        this.stopProgressTracking();
        break;
      default:
        this.state.playerState = 'stopped';
        console.log('Player stopped');
        this.stopProgressTracking();
    }
    
    // Log state change if significant
    if (previousState !== this.state.playerState) {
      console.log(`Player state: ${previousState} → ${this.state.playerState}`);
    }
    
    this.notifyStateChange();
  }

  // Progress tracking
  startProgressTracking() {
    if (this.progressInterval) return;
    
    this.progressInterval = setInterval(() => {
      if (this.player && this.state.playerState === 'playing') {
        try {
          this.state.currentTime = this.player.getCurrentTime() || 0;
          this.state.duration = this.player.getDuration() || 0;
          this.notifyProgress();
        } catch (e) {
          console.warn('Error getting video progress:', e);
        }
      }
    }, 1000);
  }

  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // Playback control methods
  playVideo(id, title) {
    if (!this.player) {
      // Defer playback until player is ready
      this.pendingPlay = { id, title };
      this.state.videoId = id;
      this.state.videoTitle = title;
      this.state.playerState = 'loading';
      storageService.setItem(STORAGE_KEYS.CURRENT_VIDEO, { id, title });
      this.notifyStateChange();
      return;
    }
    
    this.player.loadVideoById(id);
    this.state.videoId = id;
    this.state.videoTitle = title;
    this.state.playerState = 'playing';
    // Persist current video
    storageService.setItem(STORAGE_KEYS.CURRENT_VIDEO, { id, title });
    
    this.notifyStateChange();
  }

  play() {
    if (this.player?.playVideo) {
      this.player.playVideo();
    }
  }

  pause() {
    if (this.player?.pauseVideo) {
      this.player.pauseVideo();
    }
  }

  playNext() {
    // Use playlist store actions if available, otherwise fall back to direct storage access
    if (playlistStoreActions) {
      playlistStoreActions.playNext();
    } else {
      // Fallback to direct storage manipulation
      const upcoming = storageService.getItem(STORAGE_KEYS.UPCOMING) || [];
      
      if (upcoming.length > 0) {
        const nextVideo = upcoming.shift();
        this.playVideo(nextVideo.id, nextVideo.title);
        storageService.setItem(STORAGE_KEYS.UPCOMING, upcoming);
      } else {
        // If no more videos in queue, clear player state
        this.state.videoId = null;
        this.state.videoTitle = null;
        this.state.playerState = 'stopped';
        storageService.removeItem(STORAGE_KEYS.CURRENT_VIDEO);
        console.log('No more videos in queue - player stopped');
        
        this.notifyStateChange();
      }
    }
  }

  // Playlist management
  queueVideo(id, title) {
    // Use playlist store actions if available, otherwise fall back to direct storage access
    if (playlistStoreActions) {
      return playlistStoreActions.addVideo(id, title);
    } else {
      // Fallback to direct storage manipulation
      const upcoming = storageService.getItem(STORAGE_KEYS.UPCOMING) || [];
      const video = { id, title };
      upcoming.push(video);
      storageService.setItem(STORAGE_KEYS.UPCOMING, upcoming);
      return upcoming;
    }
  }

  deleteVideo(id) {
    // Use playlist store actions if available, otherwise fall back to direct storage access
    if (playlistStoreActions) {
      playlistStoreActions.removeVideo(id);
      return this.getUpcoming();
    } else {
      // Fallback to direct storage manipulation
      const upcoming = storageService.getItem(STORAGE_KEYS.UPCOMING) || [];
      const filteredUpcoming = upcoming.filter(video => video.id !== id);
      storageService.setItem(STORAGE_KEYS.UPCOMING, filteredUpcoming);
      return filteredUpcoming;
    }
  }

  getUpcoming() {
    return storageService.getItem(STORAGE_KEYS.UPCOMING) || [];
  }

  // Method to get upcoming from playlist store if available
  getUpcomingFromStore() {
    if (playlistStoreActions?.getUpcoming) {
      return playlistStoreActions.getUpcoming();
    }
    return this.getUpcoming();
  }

  // Utility methods
  isVideoEnded() {
    return this.state.playerState === 'ended';
  }

  getVideoProgress() {
    if (!this.player) return null;
    
    try {
      const currentTime = this.state.currentTime;
      const duration = this.state.duration;
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
      
      return {
        currentTime,
        duration,
        progress,
        isEnded: this.state.playerState === 'ended',
        timeRemaining: Math.max(0, duration - currentTime)
      };
    } catch (e) {
      console.warn('Error getting video progress:', e);
      return null;
    }
  }

  formatTime(seconds) {
    if (!seconds || seconds < 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // State management for reactivity
  onStateChange(callback) {
    this.stateChangeCallbacks.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.stateChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.stateChangeCallbacks.splice(index, 1);
      }
    };
  }

  onProgress(callback) {
    this.progressCallbacks.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.progressCallbacks.indexOf(callback);
      if (index > -1) {
        this.progressCallbacks.splice(index, 1);
      }
    };
  }

  notifyStateChange() {
    this.stateChangeCallbacks.forEach(callback => {
      try {
        callback(this.state);
      } catch (e) {
        console.error('Error in state change callback:', e);
      }
    });
  }

  notifyProgress() {
    const progress = this.getVideoProgress();
    this.progressCallbacks.forEach(callback => {
      try {
        callback(progress);
      } catch (e) {
        console.error('Error in progress callback:', e);
      }
    });
  }

  // Getters for current state
  getState() {
    return { ...this.state };
  }

  isReady() {
    return this.ready;
  }

  // Toggle controls enabled/disabled
  toggleControls() {
    if (this.isRecreating) {
      console.log('Recreation in progress, ignoring controls toggle');
      return;
    }
    
    this.state.controlsEnabled = !this.state.controlsEnabled;
    storageService.setItem(STORAGE_KEYS.CONTROLS_ENABLED, this.state.controlsEnabled);
    
    // Recreate the player with new controls setting
    this.recreatePlayer();
    this.notifyStateChange();
  }

  // Get controls enabled state
  getControlsEnabled() {
    return this.state.controlsEnabled;
  }

  // Recreate the player (useful when changing settings)
  recreatePlayer() {
    if (!this.ready || !this.player || this.isRecreating) return;
    
    this.isRecreating = true;
    
    // Save current video state
    const currentVideo = {
      id: this.state.videoId,
      title: this.state.videoTitle,
      currentTime: 0,
      wasPlaying: this.state.playerState === 'playing'
    };
    
    // Try to get current time if available
    try {
      if (this.player.getCurrentTime) {
        currentVideo.currentTime = this.player.getCurrentTime() || 0;
      }
    } catch (e) {
      console.warn('Could not get current time during recreation:', e);
    }
    
    console.log('Recreating player with controls:', this.state.controlsEnabled, 'Video state:', currentVideo);
    
    // Destroy current player
    try {
      this.player.destroy();
    } catch (e) {
      console.warn('Error destroying player:', e);
    }
    this.player = null;
    
    // Create new player with updated settings
    setTimeout(() => {
      this.createPlayer();
      
      // Restore video if there was one playing
      if (currentVideo.id) {
        setTimeout(() => {
          if (this.player && this.player.loadVideoById) {
            try {
              console.log('Restoring video:', currentVideo.id, 'at time:', currentVideo.currentTime, 'was playing:', currentVideo.wasPlaying);
              
              // Always use loadVideoById to ensure consistent behavior
              this.player.loadVideoById({
                videoId: currentVideo.id,
                startSeconds: Math.max(0, currentVideo.currentTime)
              });
              
              this.state.videoId = currentVideo.id;
              this.state.videoTitle = currentVideo.title;
              
              // Handle playback state based on what it was before
              if (currentVideo.wasPlaying) {
                this.state.playerState = 'playing';
                console.log('Video should continue playing');
                // loadVideoById automatically starts playback
              } else {
                console.log('Video should be paused');
                // Need to pause after a short delay to let the video load
                setTimeout(() => {
                  if (this.player && this.player.pauseVideo) {
                    this.player.pauseVideo();
                    this.state.playerState = 'paused';
                    this.notifyStateChange();
                  }
                }, 1500); // Increased delay to ensure video loads
              }
              
              this.notifyStateChange();
            } catch (e) {
              console.warn('Error restoring video during recreation:', e);
              // Enhanced fallback strategy
              try {
                console.log('Trying fallback restoration method');
                if (currentVideo.wasPlaying) {
                  // For playing videos, use loadVideoById
                  this.player.loadVideoById(currentVideo.id, currentVideo.currentTime);
                  this.state.playerState = 'playing';
                } else {
                  // For paused videos, use cueVideoById then seek
                  this.player.cueVideoById(currentVideo.id, currentVideo.currentTime);
                  this.state.playerState = 'paused';
                }
                this.state.videoId = currentVideo.id;
                this.state.videoTitle = currentVideo.title;
                this.notifyStateChange();
              } catch (e2) {
                console.error('Failed to restore video with fallback:', e2);
              }
            }
          }
          
          // Reset recreation flag after restoration attempt
          setTimeout(() => {
            this.isRecreating = false;
            console.log('Recreation completed');
          }, 2000);
        }, 800); // Increased timeout for better reliability
      } else {
        // No video to restore, just reset flag
        setTimeout(() => {
          this.isRecreating = false;
        }, 500);
      }
    }, 100);
  }

  // Cleanup method
  destroy() {
    this.stopProgressTracking();
    this.stateChangeCallbacks = [];
    this.progressCallbacks = [];
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }
}