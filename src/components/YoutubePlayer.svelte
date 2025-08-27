<script>
  import { onMount, onDestroy } from 'svelte';
  import { youtubeState, youtubeActions } from '../stores/youtube.js';

  let playerContainer;

  onMount(() => {
    // Ensure the player element is available before initializing
    // Add a small delay to ensure DOM is fully ready
    const initializePlayer = () => {
      const playerElement = document.getElementById('youtube-player');
      if (playerElement) {
        // The YouTube service will automatically find and initialize the player
        console.log('YouTube player element found and ready for initialization');
      } else {
        // Retry after a short delay if element not found
        setTimeout(initializePlayer, 50);
      }
    };
    
    // Start initialization after a brief delay to ensure DOM is ready
    setTimeout(initializePlayer, 100);
  });

  onDestroy(() => {
    // Cleanup is handled by the YouTube service
  });
</script>

<div class="youtube-player-container">
  <div id="youtube-player" bind:this={playerContainer}></div>
  
  {#if !$youtubeState.ready}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Cargando Reproductor de YouTube...</p>
    </div>
  {/if}
  
  {#if $youtubeState.ready && !$youtubeState.videoId}
    <div class="no-video-overlay">
      <div class="no-video-message">
        <h3>🎵 Bienvenido a Rockola YouTube</h3>
        <p>¡Busca videos arriba o inicia tu lista de reproducción para comenzar!</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .youtube-player-container {
    position: relative;
    width: 100%;
    height: 400px;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #youtube-player {
    width: 100%;
    height: 100%;
  }

  .loading-overlay,
  .no-video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    z-index: 10;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .no-video-message {
    text-align: center;
    max-width: 400px;
    padding: 20px;
  }

  .no-video-message h3 {
    margin: 0 0 15px 0;
    font-size: 1.5em;
    font-weight: 300;
  }

  .no-video-message p {
    margin: 0;
    opacity: 0.8;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .youtube-player-container {
      height: 300px;
    }
    
    .no-video-message h3 {
      font-size: 1.2em;
    }
    
    .no-video-message p {
      font-size: 0.9em;
    }
  }
</style>