<script>
  import { onMount, onDestroy } from 'svelte';
  import { youtubeState, youtubeActions, controlsEnabled } from '../stores/youtube.js';

  let playerContainer;
  
  // Local variable to handle checkbox state
  let controlsChecked = false;
  
  // Subscribe to the store to update local variable
  $: controlsChecked = $controlsEnabled;

  function toggleControls() {
    youtubeActions.toggleControls();
  }

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
  
  <!-- Controls Toggle -->
  <div class="controls-toggle">
    <label class="checkbox-container">
      <input type="checkbox" checked={controlsChecked} on:change={toggleControls} />
      <span class="checkmark"></span>
      <span class="label-text">Controles del reproductor</span>
    </label>
  </div>
</div>

<style>
  .youtube-player-container {
    position: relative;
    width: 100%;
    height: 400px;
    background-color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  #youtube-player {
    width: 100%;
    flex-grow: 1;
    min-height: 0;
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

  .controls-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    width: 100%;
    background: var(--jukebox-darker);
    border-top: 2px solid var(--jukebox-chrome-dark);
    flex-shrink: 0;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.9em;
    color: var(--jukebox-secondary);
    gap: 10px;
    user-select: none;
  }

  .checkbox-container input[type="checkbox"] {
    display: none;
  }

  .checkmark {
    width: 20px;
    height: 20px;
    background: var(--jukebox-darker);
    border: 2px solid var(--jukebox-chrome-dark);
    border-radius: 4px;
    position: relative;
    transition: all 0.3s ease;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
  }

  .checkmark::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 8px;
    height: 8px;
    background: var(--jukebox-accent);
    border-radius: 2px;
    transition: transform 0.2s ease;
    box-shadow: 0 0 8px var(--jukebox-accent);
  }

  .checkbox-container input[type="checkbox"]:checked + .checkmark {
    background: var(--jukebox-dark);
    border-color: var(--jukebox-accent);
    box-shadow: 0 0 10px rgba(255,255,0,0.3), inset 0 0 5px rgba(255,255,0,0.1);
  }

  .checkbox-container input[type="checkbox"]:checked + .checkmark::after {
    transform: translate(-50%, -50%) scale(1);
  }

  .checkbox-container:hover .checkmark {
    border-color: var(--jukebox-secondary);
    box-shadow: 0 0 8px rgba(0,255,255,0.2), inset 0 0 5px rgba(0,0,0,0.5);
  }

  .label-text {
    font-family: 'Orbitron', 'Montserrat', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
    text-shadow: 0 0 5px var(--jukebox-secondary);
  }

  @media (max-width: 768px) {
    .controls-toggle {
      justify-content: center;
    }
    
    .checkbox-container {
      font-size: 0.85em;
    }
  }
</style>