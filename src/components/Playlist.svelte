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
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }

  h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-weight: 500;
    font-size: 1.1em;
  }

  #upcoming {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 400px;
    overflow-y: auto;
  }

  .playlist-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;
  }

  .playlist-item:hover {
    background-color: #f8f9fa;
  }

  .playlist-item:last-child {
    border-bottom: none;
  }

  .item-number {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;
    font-weight: 500;
    flex-shrink: 0;
  }

  .item-title {
    flex: 1;
    margin: 0;
    font-size: 0.9em;
    line-height: 1.3;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .item-title.next-to-play {
    font-weight: 600;
    color: #2e7d32;
    position: relative;
  }

  .item-title.next-to-play::before {
    content: "▶️ ";
    margin-right: 5px;
  }

  .item-delete {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1em;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    opacity: 0.6;
  }

  .item-delete:hover {
    opacity: 1;
    background-color: #ffebee;
    transform: scale(1.1);
  }

  .playlist-summary {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
    text-align: center;
  }

  .playlist-summary p {
    margin: 0;
    font-size: 0.85em;
    color: #666;
    font-style: italic;
  }

  .empty-playlist {
    text-align: center;
    color: #666;
    padding: 20px 0;
  }

  .empty-playlist p {
    margin: 0 0 10px 0;
  }

  .hint {
    font-size: 0.85em;
    font-style: italic;
    color: #999;
    line-height: 1.4;
  }

  /* Custom scrollbar for playlist */
  #upcoming::-webkit-scrollbar {
    width: 6px;
  }

  #upcoming::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  #upcoming::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }

  #upcoming::-webkit-scrollbar-thumb:hover {
    background: #999;
  }

  @media (max-width: 480px) {
    .playlist-item {
      padding: 10px 8px;
    }
    
    .item-title {
      font-size: 0.85em;
    }
  }
</style>