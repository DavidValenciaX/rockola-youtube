import { storageService } from './storageService.js';

// Storage keys constants
export const STORAGE_KEYS = {
  UPCOMING: 'upcoming',
  CURRENT_VIDEO: 'current_video'
};

// YouTube service to handle player functionality
export class YouTubeService {
  constructor() {
    this.player = null;
    this.ready = false;
    this.apiLoaded = false;
    this.pendingPlay = null;
    
    // Player state
    this.state = {
      videoId: null,
      videoTitle: null,
      playerState: 'stopped',
      currentTime: 0,
      duration: 0
    };

    // Callbacks for state changes
    this.stateChangeCallbacks = [];
    this.progressCallbacks = [];

    this.loadYouTubeAPI();
  }

  // Load YouTube Iframe API
  loadYouTubeAPI() {
    if (this.apiLoaded) return;
    
    if (window.YT && window.YT.Player) {
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
      console.warn('YouTube player element not found, retrying...');
      setTimeout(() => this.createPlayer(), 100);
      return;
    }

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
        controls: 0
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

  // Playlist management
  queueVideo(id, title) {
    const upcoming = storageService.getItem(STORAGE_KEYS.UPCOMING) || [];
    const video = { id, title };
    upcoming.push(video);
    storageService.setItem(STORAGE_KEYS.UPCOMING, upcoming);
    return upcoming;
  }

  deleteVideo(id) {
    const upcoming = storageService.getItem(STORAGE_KEYS.UPCOMING) || [];
    const filteredUpcoming = upcoming.filter(video => video.id !== id);
    storageService.setItem(STORAGE_KEYS.UPCOMING, filteredUpcoming);
    return filteredUpcoming;
  }

  getUpcoming() {
    return storageService.getItem(STORAGE_KEYS.UPCOMING) || [];
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