<script>
  import { searchResults, hasSearchResults, searchError } from '../stores/search.js';
  import { youtubeActions, isReadyForNewVideo, youtubeState, hasCurrentVideo } from '../stores/youtube.js';
  import { playlistActions, hasUpcomingVideos } from '../stores/playlist.js';
  import Swal from 'sweetalert2';

  function showNotification(message) {
    Swal.fire({
      title: '🎵 Rockola YouTube',
      text: message,
      icon: 'info',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: false,
      position: 'center',
      background: 'var(--jukebox-darker)',
      color: 'var(--jukebox-secondary)',
      customClass: {
        popup: 'jukebox-alert',
        title: 'jukebox-alert-title',
        htmlContainer: 'jukebox-alert-text',
        timerProgressBar: 'jukebox-alert-progress'
      },
      didOpen: () => {
        // Apply custom styles after the modal opens
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.border = '3px solid var(--jukebox-chrome)';
          popup.style.borderRadius = '20px';
          popup.style.boxShadow = '0 0 30px rgba(0,255,255,0.4), 0 8px 32px rgba(0,0,0,0.6)';
        }
      }
    });
  }

  function selectSearchResult(video) {
    // Check if the video is currently playing
    if ($hasCurrentVideo && $youtubeState.videoId === video.id) {
      showNotification('El video ya se está reproduciendo');
      return;
    }

    // Determine whether to play immediately or queue
    const readyForNewVideo = $isReadyForNewVideo;
    const hasQueue = $hasUpcomingVideos;
    
    // Play immediately if:
    // 1. Player is ready for a new video (no video active or ended)
    // 2. No queue exists
    if (readyForNewVideo && !hasQueue) {
      youtubeActions.playVideo(video.id, video.title);
      console.log('Playing now:', video.title);
    } else {
      const result = playlistActions.addVideo(video.id, video.title);
      if (result === null) {
        // Video couldn't be added because it's currently playing
        showNotification('El video ya se está reproduciendo');
      } else {
        console.log('Queued:', video.title);
      }
    }
  }

  function formatDuration(duration) {
    // If duration is already a formatted string (like "3:45"), return it
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    
    // If duration is a number (seconds), convert to minutes:seconds format
    if (typeof duration === 'number' && !isNaN(duration)) {
      const minutes = Math.floor(duration / 60);
      const seconds = (duration % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
    
    // If duration is invalid or missing, return a default
    return '0:00';
  }
</script>

{#if $searchError}
  <div class="error-message">
    <p>❌ Error de Búsqueda: {$searchError}</p>
  </div>
{/if}



{#if $hasSearchResults}
  <div id="search-results">
    <h3>Resultados de Búsqueda</h3>
    <div class="results-grid">
      {#each $searchResults as video (video.id)}
        <div class="search-result" on:click={() => selectSearchResult(video)} on:keydown={(e) => e.key === 'Enter' && selectSearchResult(video)} role="button" tabindex="0">
          <img class="search-thumbnail" src={video.thumbnail} alt={video.title} loading="lazy">
          <div class="search-info">
            <p class="search-title">{video.title}</p>
            <p class="search-author">{video.author}</p>
            {#if video.duration}
              <p class="search-duration">{formatDuration(video.duration)}</p>
            {/if}
          </div>
          <div class="action-hint">
            {#if $hasCurrentVideo && $youtubeState.videoId === video.id}
              <span class="playing-hint">🎵 Reproduciendo</span>
            {:else if $isReadyForNewVideo && !$hasUpcomingVideos}
              <span class="play-hint">▶️ Clic para reproducir</span>
            {:else}
              <span class="queue-hint">➕ Clic para añadir</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  /* SearchResults Component - Self-contained styling */
  
  .error-message {
    padding: 18px 25px;
    background: var(--jukebox-darker);
    color: var(--jukebox-primary);
    border: 2px solid var(--jukebox-primary);
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(255,0,64,0.3);
    margin-bottom: 15px;
  }

  .error-message p {
    margin: 0;
    text-shadow: 0 0 5px var(--jukebox-primary);
    font-family: var(--font-orbitron);
  }

  /* Search Results Container */
  #search-results {
    padding: 20px;
    background: var(--dark-gradient);
    /* Use calculated height instead of flex: 1 to prevent recalculation loops */
    height: calc(100% - 400px); /* Subtract YouTube player height */
    overflow-y: auto;
    overflow-x: hidden;
    border-top: 2px solid var(--jukebox-chrome);
    position: relative;
    /* Force hardware acceleration for smoother scrolling */
    will-change: scroll-position;
  }

  #search-results::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      var(--jukebox-secondary) 50%, 
      transparent 100%);
    animation: scanLine 2s ease-in-out infinite;
  }

  #search-results h3 {
    margin: 0 0 20px 0;
    color: var(--jukebox-secondary);
    text-shadow: 0 0 10px var(--jukebox-secondary);
    font-size: 1.1em;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: var(--font-orbitron);
  }

  /* Results Grid Layout */
  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 15px;
  }

  /* Individual Search Result */
  .search-result {
    display: flex;
    background: var(--chrome-gradient);
    padding: 12px;
    border: 1px solid var(--jukebox-chrome-dark);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: var(--transition-standard);
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .search-result::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--jukebox-secondary);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .search-result:hover {
    background: var(--chrome-gradient-reverse);
    border-color: var(--jukebox-secondary);
    box-shadow: 0 0 20px rgba(0,255,255,0.4), 
                0 5px 15px rgba(0,0,0,0.4);
    transform: translateY(-3px) scale(1.02);
  }

  .search-result:hover::before {
    opacity: 1;
  }

  .search-result:focus {
    outline: 2px solid var(--jukebox-accent);
    outline-offset: 3px;
    box-shadow: 0 0 20px var(--jukebox-accent);
  }

  /* Thumbnail Styling */
  .search-thumbnail {
    width: 130px;
    height: 95px;
    object-fit: cover;
    flex-shrink: 0;
    border-right: 2px solid var(--jukebox-chrome-dark);
    transition: var(--transition-standard);
  }

  .search-result:hover .search-thumbnail {
    border-right-color: var(--jukebox-secondary);
    box-shadow: 0 0 15px rgba(0,255,255,0.3);
  }

  /* Video Information */
  .search-info {
    padding: 12px 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .search-title {
    font-weight: 600;
    margin: 0 0 8px 0;
    font-size: 0.9em;
    line-height: 1.3;
    color: var(--jukebox-darker);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-family: var(--font-orbitron);
  }

  .search-author {
    margin: 0 0 6px 0;
    font-size: 0.8em;
    color: var(--jukebox-dark);
    font-weight: 500;
    opacity: 0.8;
  }

  .search-duration {
    margin: 0;
    font-size: 0.75em;
    color: var(--jukebox-dark);
    font-family: 'Courier New', monospace;
    background: var(--jukebox-darker);
    color: var(--jukebox-secondary);
    padding: 2px 6px;
    border-radius: 4px;
    align-self: flex-start;
    text-shadow: 0 0 3px var(--jukebox-secondary);
  }

  /* Action Hints */
  .action-hint {
    position: absolute;
    top: 8px;
    right: 8px;
    background: var(--jukebox-darker);
    color: var(--jukebox-secondary);
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.7em;
    opacity: 0;
    transition: var(--transition-standard);
    border: 1px solid var(--jukebox-chrome-dark);
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    font-family: var(--font-orbitron);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .search-result:hover .action-hint {
    opacity: 1;
    transform: scale(1.05);
  }

  .play-hint {
    color: var(--jukebox-green) !important;
    text-shadow: 0 0 5px var(--jukebox-green);
  }

  .queue-hint {
    color: var(--jukebox-secondary) !important;
    text-shadow: 0 0 5px var(--jukebox-secondary);
  }

  .playing-hint {
    color: var(--jukebox-accent) !important;
    text-shadow: 0 0 5px var(--jukebox-accent);
    font-weight: bold;
  }

  /* Component-specific scrollbar */
  #search-results::-webkit-scrollbar {
    width: 8px;
  }

  #search-results::-webkit-scrollbar-track {
    background: var(--jukebox-darker);
    border-radius: 4px;
  }

  #search-results::-webkit-scrollbar-thumb {
    background: var(--chrome-gradient);
    border-radius: 4px;
    border: 1px solid var(--jukebox-chrome-dark);
  }

  #search-results::-webkit-scrollbar-thumb:hover {
    background: var(--chrome-gradient-reverse);
  }

  /* Component-specific animations */
  @keyframes scanLine {
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  /* SweetAlert2 Custom Jukebox Styling - Component specific overrides */
  :global(.jukebox-alert) {
    background: var(--jukebox-darker) !important;
    border: 3px solid var(--jukebox-chrome) !important;
    border-radius: 20px !important;
    box-shadow: 0 0 30px rgba(0,255,255,0.4), 0 8px 32px rgba(0,0,0,0.6) !important;
    font-family: var(--font-orbitron) !important;
  }

  :global(.jukebox-alert-title) {
    color: var(--jukebox-accent) !important;
    text-shadow: 0 0 10px var(--jukebox-accent) !important;
    font-family: var(--font-orbitron) !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    margin-bottom: 20px !important;
  }

  :global(.jukebox-alert-text) {
    color: var(--jukebox-secondary) !important;
    text-shadow: 0 0 5px var(--jukebox-secondary) !important;
    font-family: var(--font-orbitron) !important;
    font-size: 16px !important;
    font-weight: 500 !important;
  }

  :global(.jukebox-alert-progress) {
    background: var(--jukebox-secondary) !important;
    height: 4px !important;
    border-radius: 2px !important;
    box-shadow: 0 0 10px var(--jukebox-secondary) !important;
  }

  :global(.jukebox-alert .swal2-icon.swal2-info) {
    border-color: var(--jukebox-secondary) !important;
    color: var(--jukebox-secondary) !important;
  }

  :global(.jukebox-alert .swal2-icon.swal2-info::before) {
    content: '🎵' !important;
    font-size: 24px !important;
    color: var(--jukebox-secondary) !important;
  }

  :global(.jukebox-alert .swal2-icon-content) {
    display: none !important;
  }

  /* Responsive Design - Component specific */
  @media (max-width: 768px) {
    .results-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    .search-result {
      flex-direction: column;
    }
    
    .search-thumbnail {
      width: 100%;
      height: 180px;
      border-right: none;
      border-bottom: 2px solid var(--jukebox-chrome-dark);
    }
    
    .search-result:hover .search-thumbnail {
      border-bottom-color: var(--jukebox-secondary);
      border-right-color: transparent;
    }
    
    .search-info {
      padding: 15px;
    }
    
    .action-hint {
      top: 8px;
      right: 8px;
    }
  }

  @media (max-width: 480px) {
    #search-results {
      padding: 15px;
    }
    
    .results-grid {
      gap: 10px;
    }
    
    .search-title {
      font-size: 0.85em;
    }
    
    .search-author {
      font-size: 0.75em;
    }
  }
</style>