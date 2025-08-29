<script>
  import { upcoming, hasUpcomingVideos, playlistActions } from '../stores/playlist.js';

  function deleteVideo(videoId) {
    playlistActions.removeVideo(videoId);
  }

  function getItemClass(index) {
    return ''; // Removed special styling for next-to-play
  }

  function playVideoFromPlaylist(videoId) {
    playlistActions.playFromPlaylist(videoId);
  }
</script>

<div id="playlist">
  <h3>Lista de Reproducción</h3>
  
  {#if $hasUpcomingVideos}
    <ol id="upcoming">
      {#each $upcoming as video, index (video.id + '_' + (video.timestamp || index))}
        <li class="playlist-item">
          <span class="item-number">{index + 1}</span>
          <button 
            class="item-title {getItemClass(index)}" 
            on:click={() => playVideoFromPlaylist(video.id)}
            title="Haz clic para reproducir este video"
          >
            {video.title}
          </button>
          <button 
            class="item-delete" 
            on:click={() => deleteVideo(video.id)}
            title="Eliminar de la lista"
          >
            🗑️
          </button>
        </li>
      {/each}
    </ol>
    
    <div class="playlist-summary">
      <p>{$upcoming.length} video{$upcoming.length !== 1 ? 's' : ''} en cola</p>
    </div>
  {:else}
    <div class="empty-playlist">
      <p>Tu lista de reproducción está vacía</p>
      <p class="hint">¡Busca videos y haz clic en ellos para añadirlos a tu cola!</p>
    </div>
  {/if}
</div>

<style>
  /* Playlist Component - Fully Self-Contained Styles */
  
  /* Playlist Container */
  #playlist {
    background: var(--dark-gradient);
    border: 2px solid var(--jukebox-chrome-dark);
    border-radius: 0 0 15px 15px;
    padding: 0;
    position: relative;
    box-shadow: inset 0 0 15px rgba(0,255,255,0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    color: var(--jukebox-chrome);
    font-size: 14px;
  }

  /* Animated Scanner Line */
  #playlist::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      var(--jukebox-accent) 50%, 
      transparent 100%);
    animation: scanLine 3s ease-in-out infinite;
  }

  /* Playlist Header */
  h3 {
    margin: 0;
    padding: var(--spacing-lg) var(--spacing-xl) 15px;
    color: var(--jukebox-accent);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1em;
    text-shadow: 0 0 10px var(--jukebox-accent);
    border-bottom: 1px solid var(--jukebox-chrome-dark);
    background: var(--jukebox-darker);
    font-family: var(--font-orbitron);
  }

  /* Playlist Items Container */
  #upcoming {
    list-style: none;
    padding: 15px;
    margin: 0;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    cursor: pointer;
  }

  /* Individual Playlist Items */
  .playlist-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: 0;
    margin-bottom: 10px;
    border: 1px solid var(--jukebox-chrome-dark);
    background: var(--chrome-gradient);
    border-radius: var(--border-radius-medium);
    transition: var(--transition-standard);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }

  /* Hover Indicator Bar */
  .playlist-item::before {
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

  /* Playlist Item Hover Effects */
  .playlist-item:hover {
    background: var(--chrome-gradient-reverse);
    border-color: var(--jukebox-secondary);
    box-shadow: 0 0 15px rgba(0,255,255,0.3), 
                0 4px var(--spacing-xs) rgba(0,0,0,0.3);
    transform: translateX(5px);
  }

  .playlist-item:hover::before {
    opacity: 1;
  }

  .playlist-item:last-child {
    margin-bottom: 5px;
  }

  /* Item Number Circles */
  .item-number {
    background: var(--neon-gradient);
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85em;
    font-weight: bold;
    flex-shrink: 0;
    box-shadow: 0 0 10px var(--jukebox-primary), 
                0 2px 4px rgba(0,0,0,0.3);
    transition: var(--transition-standard);
    border: 2px solid var(--jukebox-chrome);
    margin: 10px 0 10px var(--spacing-sm);
    font-family: var(--font-orbitron);
  }

  /* Clickable Title Buttons */
  .item-title {
    flex: 1;
    margin: 0;
    padding: 15px 10px;
    font-size: 0.9em;
    line-height: 1.3;
    color: var(--jukebox-darker);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    cursor: pointer;
    transition: var(--transition-standard);
    border-radius: var(--border-radius-small);
    position: relative;
    
    /* Button Reset Styles */
    background: none;
    border: none;
    text-align: left;
    font-family: inherit;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .item-title:hover {
    background: rgba(0, 255, 255, 0.1);
    color: var(--jukebox-secondary);
    text-shadow: 0 0 var(--spacing-xs) var(--jukebox-secondary);
    transform: scale(1.02);
  }

  .item-title:focus {
    outline: 2px solid var(--jukebox-secondary);
    outline-offset: 2px;
    background: rgba(0, 255, 255, 0.15);
  }

  /* Delete Buttons */
  .item-delete {
    background: var(--chrome-gradient);
    border: 1px solid var(--jukebox-chrome-dark);
    border-radius: var(--border-radius-small);
    cursor: pointer;
    font-size: 1.1em;
    padding: 0;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-standard);
    opacity: 0.7;
    margin: var(--spacing-xs) var(--spacing-sm) var(--spacing-xs) 0;
    color: var(--jukebox-primary);
  }

  .item-delete:hover {
    opacity: 1;
    background: var(--jukebox-primary);
    color: white;
    border-color: var(--jukebox-primary);
    box-shadow: 0 0 15px var(--jukebox-primary);
    transform: scale(1.15);
  }

  /* Playlist Summary Footer */
  .playlist-summary {
    margin: 0;
    padding: 15px var(--spacing-xl) var(--spacing-lg);
    border-top: 1px solid var(--jukebox-chrome-dark);
    text-align: center;
    background: var(--jukebox-darker);
    margin-top: auto;
  }

  .playlist-summary p {
    margin: 0;
    font-size: 0.9em;
    color: var(--jukebox-secondary);
    font-style: italic;
    text-shadow: 0 0 5px var(--jukebox-secondary);
    font-family: var(--font-orbitron);
  }

  /* Empty State */
  .empty-playlist {
    text-align: center;
    color: var(--jukebox-chrome-dark);
    padding: 40px var(--spacing-lg);
  }

  .empty-playlist p {
    margin: 0 0 15px 0;
    font-size: 1.1em;
    color: var(--jukebox-secondary);
    text-shadow: 0 0 5px var(--jukebox-secondary);
  }

  .hint {
    font-size: 0.9em;
    font-style: italic;
    color: var(--jukebox-chrome-dark);
    line-height: 1.4;
    opacity: 0.8;
  }

  /* Component-Specific Responsive Design */
  @media (max-width: 768px) {
    .item-title {
      font-size: 0.85em;
      margin-right: 45px;
    }
    
    .item-number {
      width: 28px;
      height: 28px;
      font-size: 0.75em;
    }
    
    .item-delete {
      width: 35px;
      height: 35px;
      font-size: 1em;
    }
  }

  @media (max-width: 480px) {
    .playlist-item {
      padding: 0;
      gap: 10px;
    }
    
    .item-number {
      width: 30px;
      height: 30px;
      font-size: 0.75em;
      margin: var(--spacing-xs) 0 var(--spacing-xs) 10px;
    }
    
    .item-title {
      font-size: 0.85em;
      padding: var(--spacing-sm) var(--spacing-xs);
    }
    
    .item-delete {
      width: 38px;
      height: 38px;
      font-size: 1em;
      margin: 6px 10px 6px 0;
    }
    
    h3 {
      padding: 15px var(--spacing-lg) var(--spacing-sm);
      font-size: 0.9em;
    }
    
    .playlist-summary {
      padding: var(--spacing-sm) var(--spacing-lg) 15px;
    }
  }
</style>