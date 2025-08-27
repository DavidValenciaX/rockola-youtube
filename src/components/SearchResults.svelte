<script>
  import { searchResults, hasSearchResults, searchError } from '../stores/search.js';
  import { youtubeActions, isReadyForNewVideo } from '../stores/youtube.js';
  import { playlistActions, hasUpcomingVideos } from '../stores/playlist.js';

  function selectSearchResult(video) {
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
      playlistActions.addVideo(video.id, video.title);
      console.log('Queued:', video.title);
    }
  }
</script>

{#if $searchError}
  <div class="error-message">
    <p>❌ Search Error: {$searchError}</p>
  </div>
{/if}

{#if $hasSearchResults}
  <div id="search-results">
    <h3>Search Results</h3>
    <div class="results-grid">
      {#each $searchResults as video (video.id)}
        <div class="search-result" on:click={() => selectSearchResult(video)} on:keydown={(e) => e.key === 'Enter' && selectSearchResult(video)} role="button" tabindex="0">
          <img class="search-thumbnail" src={video.thumbnail} alt={video.title} loading="lazy">
          <div class="search-info">
            <p class="search-title">{video.title}</p>
            <p class="search-author">{video.author}</p>
            {#if video.duration}
              <p class="search-duration">{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</p>
            {/if}
          </div>
          <div class="action-hint">
            {#if $isReadyForNewVideo && !$hasUpcomingVideos}
              <span class="play-hint">▶️ Click to play</span>
            {:else}
              <span class="queue-hint">➕ Click to queue</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  #search-results {
    padding: 20px;
    background-color: #f9f9f9;
    flex: 1;
    overflow-y: auto;
  }

  #search-results h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-weight: 500;
  }

  .error-message {
    padding: 15px 20px;
    background-color: #ffebee;
    color: #c62828;
    border-left: 4px solid #f44336;
  }

  .error-message p {
    margin: 0;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
  }

  .search-result {
    display: flex;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .search-result:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .search-result:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  .search-thumbnail {
    width: 120px;
    height: 90px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .search-info {
    padding: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .search-title {
    font-weight: 500;
    margin: 0 0 5px 0;
    font-size: 0.9em;
    line-height: 1.3;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .search-author {
    margin: 0 0 5px 0;
    font-size: 0.8em;
    color: #666;
    font-weight: 400;
  }

  .search-duration {
    margin: 0;
    font-size: 0.75em;
    color: #888;
    font-family: monospace;
  }

  .action-hint {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.7em;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .search-result:hover .action-hint {
    opacity: 1;
  }

  .play-hint {
    color: #4CAF50;
  }

  .queue-hint {
    color: #2196F3;
  }

  @media (max-width: 768px) {
    .results-grid {
      grid-template-columns: 1fr;
    }
    
    .search-result {
      flex-direction: column;
    }
    
    .search-thumbnail {
      width: 100%;
      height: 180px;
    }
    
    .search-info {
      padding: 15px;
    }
  }
</style>