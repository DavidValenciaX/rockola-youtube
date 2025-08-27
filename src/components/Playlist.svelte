<script>
  import { upcoming, hasUpcomingVideos, playlistActions } from '../stores/playlist.js';

  function deleteVideo(videoId) {
    playlistActions.removeVideo(videoId);
  }

  function getItemClass(index) {
    return playlistActions.getItemClass(index);
  }
</script>

<div id="playlist">
  <h3>Lista de Reproducción</h3>
  
  {#if $hasUpcomingVideos}
    <ol id="upcoming">
      {#each $upcoming as video, index (video.id + '_' + (video.timestamp || index))}
        <li class="playlist-item">
          <span class="item-number">{index + 1}</span>
          <p class="item-title {getItemClass(index)}">
            {video.title}
          </p>
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
  #playlist {
    background: var(--dark-gradient);
    border: 2px solid var(--jukebox-chrome-dark);
    border-radius: 0 0 15px 15px;
    padding: 0;
    position: relative;
    box-shadow: inset 0 0 15px rgba(0,255,255,0.05);
    overflow: hidden;
  }

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
    animation: playlistScan 3s ease-in-out infinite;
  }

  h3 {
    margin: 0;
    padding: 20px 25px 15px;
    color: var(--jukebox-accent);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1em;
    text-shadow: 0 0 10px var(--jukebox-accent);
    border-bottom: 1px solid var(--jukebox-chrome-dark);
    background: var(--jukebox-darker);
    font-family: 'Orbitron', 'Montserrat', sans-serif;
  }

  #upcoming {
    list-style: none;
    padding: 15px;
    margin: 0;
    max-height: 400px;
    overflow-y: auto;
  }

  /* Jukebox Style Playlist Items */
  .playlist-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0;
    margin-bottom: 10px;
    border: 1px solid var(--jukebox-chrome-dark);
    background: var(--chrome-gradient);
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    overflow: hidden;
    position: relative;
  }

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

  .playlist-item:hover {
    background: var(--chrome-gradient-reverse);
    border-color: var(--jukebox-secondary);
    box-shadow: 0 0 15px rgba(0,255,255,0.3), 
                0 4px 8px rgba(0,0,0,0.3);
    transform: translateX(5px);
  }

  .playlist-item:hover::before {
    opacity: 1;
  }

  .playlist-item:last-child {
    margin-bottom: 5px;
  }

  /* Jukebox Number Buttons */
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
    transition: all 0.3s ease;
    border: 2px solid var(--jukebox-chrome);
    margin: 10px 0 10px 12px;
    font-family: 'Orbitron', 'Montserrat', sans-serif;
  }

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
  }

  .item-title.next-to-play {
    font-weight: 700;
    color: var(--jukebox-darker);
    text-shadow: 0 0 5px var(--jukebox-accent);
    position: relative;
  }

  .item-title.next-to-play::before {
    content: "▶️ ";
    margin-right: 8px;
    filter: drop-shadow(0 0 5px var(--jukebox-accent));
  }

  .next-to-play .item-number {
    background: var(--jukebox-accent);
    animation: jukeboxPulse 1.5s infinite;
    box-shadow: 0 0 20px var(--jukebox-accent),
                0 0 30px var(--jukebox-accent),
                0 2px 4px rgba(0,0,0,0.3);
  }

  /* Delete Button - Jukebox Style */
  .item-delete {
    background: var(--chrome-gradient);
    border: 1px solid var(--jukebox-chrome-dark);
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    padding: 0;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 0.7;
    margin: 8px 12px 8px 0;
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

  .playlist-summary {
    margin: 0;
    padding: 15px 25px 20px;
    border-top: 1px solid var(--jukebox-chrome-dark);
    text-align: center;
    background: var(--jukebox-darker);
  }

  .playlist-summary p {
    margin: 0;
    font-size: 0.9em;
    color: var(--jukebox-secondary);
    font-style: italic;
    text-shadow: 0 0 5px var(--jukebox-secondary);
    font-family: 'Orbitron', 'Montserrat', sans-serif;
  }

  .empty-playlist {
    text-align: center;
    color: var(--jukebox-chrome-dark);
    padding: 40px 20px;
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

  /* Custom scrollbar for playlist */
  #upcoming::-webkit-scrollbar {
    width: 8px;
  }

  #upcoming::-webkit-scrollbar-track {
    background: var(--jukebox-darker);
    border-radius: 4px;
  }

  #upcoming::-webkit-scrollbar-thumb {
    background: var(--chrome-gradient);
    border-radius: 4px;
    border: 1px solid var(--jukebox-chrome-dark);
  }

  #upcoming::-webkit-scrollbar-thumb:hover {
    background: var(--chrome-gradient-reverse);
  }

  /* Animations */
  @keyframes playlistScan {
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  }

  @keyframes jukeboxPulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 20px var(--jukebox-accent);
    }
    50% { 
      transform: scale(1.1);
      box-shadow: 0 0 30px var(--jukebox-accent), 0 0 40px var(--jukebox-accent);
    }
  }

  /* Responsive Design */
  @media (max-width: 480px) {
    .playlist-item {
      padding: 0;
      gap: 10px;
    }
    
    .item-number {
      width: 30px;
      height: 30px;
      font-size: 0.75em;
      margin: 8px 0 8px 10px;
    }
    
    .item-title {
      font-size: 0.85em;
      padding: 12px 8px;
    }
    
    .item-delete {
      width: 38px;
      height: 38px;
      font-size: 1em;
      margin: 6px 10px 6px 0;
    }
    
    h3 {
      padding: 15px 20px 12px;
      font-size: 0.9em;
    }
    
    .playlist-summary {
      padding: 12px 20px 15px;
    }
  }
</style>