import { writable, derived } from 'svelte/store';
import { YouTubeService } from '../services/youtubeService.js';

// Create YouTube service instance
export const youtubeService = new YouTubeService();

// YouTube player state store
export const youtubeState = writable({
  ready: false,
  videoId: null,
  videoTitle: null,
  playerState: 'stopped',
  currentTime: 0,
  duration: 0
});

// Progress store
export const progress = writable({
  currentTime: 0,
  duration: 0,
  progress: 0,
  isEnded: false,
  timeRemaining: 0
});

// Subscribe to YouTube service state changes
youtubeService.onStateChange((state) => {
  youtubeState.update(currentState => ({
    ...currentState,
    ready: youtubeService.isReady(),
    videoId: state.videoId,
    videoTitle: state.videoTitle,
    playerState: state.playerState,
    currentTime: state.currentTime,
    duration: state.duration
  }));
});

// Subscribe to progress updates
youtubeService.onProgress((progressData) => {
  if (progressData) {
    progress.set(progressData);
  }
});

// Derived stores for computed values
export const isPlaying = derived(
  youtubeState,
  $youtubeState => $youtubeState.playerState === 'playing'
);

export const isPaused = derived(
  youtubeState,
  $youtubeState => $youtubeState.playerState === 'paused'
);

export const isBuffering = derived(
  youtubeState,
  $youtubeState => $youtubeState.playerState === 'buffering'
);

export const hasCurrentVideo = derived(
  youtubeState,
  $youtubeState => !!$youtubeState.videoId && $youtubeState.playerState !== 'ended'
);

export const hasAnyCurrentVideo = derived(
  youtubeState,
  $youtubeState => !!$youtubeState.videoId
);

export const isReadyForNewVideo = derived(
  youtubeState,
  $youtubeState => !$youtubeState.videoId || $youtubeState.playerState === 'ended'
);

export const formattedCurrentTime = derived(
  progress,
  $progress => youtubeService.formatTime($progress.currentTime)
);

export const formattedDuration = derived(
  progress,
  $progress => youtubeService.formatTime($progress.duration)
);

export const formattedTimeRemaining = derived(
  progress,
  $progress => youtubeService.formatTime($progress.timeRemaining)
);

// Actions - these functions interact with the YouTube service
export const youtubeActions = {
  playVideo: (id, title) => youtubeService.playVideo(id, title),
  play: () => youtubeService.play(),
  pause: () => youtubeService.pause(),
  playNext: () => youtubeService.playNext(),
  queueVideo: (id, title) => youtubeService.queueVideo(id, title),
  deleteVideo: (id) => youtubeService.deleteVideo(id),
  togglePlay: () => {
    const state = youtubeService.getState();
    if (state.playerState === 'playing') {
      youtubeService.pause();
    } else if (state.videoId && state.playerState !== 'ended') {
      youtubeService.play();
    } else {
      const upcoming = youtubeService.getUpcoming();
      if (upcoming.length > 0) {
        youtubeService.playNext();
      }
    }
  }
};