<script>
  import { youtubeState, youtubeActions, progress, formattedCurrentTime, formattedDuration, isPlaying, hasCurrentVideo } from '../stores/youtube.js';
  import { playlistActions, hasUpcomingVideos } from '../stores/playlist.js';

  function togglePlay() {
    youtubeActions.togglePlay();
  }

  function nextVideo() {
    youtubeActions.playNext();
  }

  function startPlaylist() {
    playlistActions.startPlaylist();
  }
</script>

<div class="current-video-info">
  <div class="info-header">
    <h3 class="info-title">Reproduciendo Ahora</h3>
  </div>
  
  {#if $youtubeState.videoTitle}
    <div class="video-info">
      <p class="video-title">{$youtubeState.videoTitle}</p>
      
      <div class="progress-container">
        <div class="time-info">
          <span class="current-time">{$formattedCurrentTime}</span>
          <span class="duration">{$formattedDuration}</span>
        </div>
        
        {#if $progress.duration > 0}
          <div class="progress-bar">
            <div class="progress-fill" style="width: {$progress.progress}%"></div>
          </div>
        {/if}
      </div>
      
      <div class="player-state">
        {#if $youtubeState.playerState === 'playing'}
          <span class="state-indicator playing">▶️ Reproduciendo</span>
        {:else if $youtubeState.playerState === 'paused'}
          <span class="state-indicator paused">⏸️ Pausado</span>
        {:else if $youtubeState.playerState === 'buffering'}
          <span class="state-indicator buffering">⏳ Cargando</span>
        {:else if $youtubeState.playerState === 'ended'}
          <span class="state-indicator ended">⏹️ Finalizado</span>
        {:else}
          <span class="state-indicator stopped">⏹️ Detenido</span>
        {/if}
      </div>
      
      <div class="controls">
        <button class="control-btn" on:click={togglePlay}>
          {#if $isPlaying}
            ⏸️ Pausar
          {:else if $hasCurrentVideo}
            ▶️ Reproducir
          {:else if $hasUpcomingVideos}
            ▶️ Iniciar Lista
          {:else}
            ▶️ Reproducir
          {/if}
        </button>
        
        <button class="control-btn" on:click={nextVideo} disabled={!$hasUpcomingVideos}>
          ⏭️ Siguiente
        </button>
      </div>
    </div>
  {:else}
    <div class="no-video">
      <p>No hay video reproduciéndose</p>
      {#if $hasUpcomingVideos}
        <button class="control-btn start-btn" on:click={startPlaylist}>
          ▶️ Iniciar Lista
        </button>
      {:else}
        <p class="hint">¡Busca videos para comenzar!</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* CurrentVideoInfo Component - Fully Self-Contained Styles */
  
  /* Component-specific variables for CurrentVideoInfo */
  .current-video-info {
    --info-padding: var(--spacing-xl);
    --info-border-radius: 15px;
    --info-gap: 15px;
    --progress-height: 8px;
    --control-padding: 12px 18px;
    --control-border-radius: var(--border-radius-pill);
    --state-padding: var(--spacing-xs) 15px;
    --state-border-radius: var(--border-radius-large);
    
    margin-bottom: 0;
    padding: var(--info-padding);
    background: var(--jukebox-darker);
    border: 2px solid var(--jukebox-chrome-dark);
    border-radius: var(--info-border-radius) var(--info-border-radius) 0 0;
    color: var(--jukebox-secondary);
    position: relative;
    box-shadow: inset 0 0 20px rgba(0,255,255,0.1),
                var(--chrome-shadow);
    overflow: hidden;
  }

  .current-video-info::before {
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

  .current-video-info::after {
    content: '';
    position: absolute;
    bottom: 5px;
    right: 15px;
    width: var(--spacing-xs);
    height: var(--spacing-xs);
    background: var(--jukebox-green);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--jukebox-green);
    animation: statusBlink 1.5s ease-in-out infinite;
  }

  .info-header {
    margin-bottom: var(--spacing-lg);
  }

  .info-title {
    margin: 0;
    color: var(--jukebox-accent);
    text-shadow: 0 0 10px var(--jukebox-accent);
    font-size: 1.1em;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: var(--font-orbitron);
  }

  .video-info {
    display: flex;
    flex-direction: column;
    gap: var(--info-gap);
  }

  .video-title {
    margin: 0;
    font-weight: 600;
    color: var(--jukebox-chrome);
    line-height: 1.4;
    font-size: 1em;
    text-shadow: 0 0 5px currentColor;
    font-family: var(--font-orbitron);
  }

  .progress-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--jukebox-dark);
    padding: var(--spacing-sm);
    border-radius: 10px;
    border: 1px solid var(--jukebox-chrome-dark);
  }

  .time-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    color: var(--jukebox-secondary);
    font-family: 'Courier New', monospace;
    font-weight: bold;
    text-shadow: 0 0 5px var(--jukebox-secondary);
  }

  .progress-bar {
    height: var(--progress-height);
    background: var(--jukebox-dark);
    border: 1px solid var(--jukebox-chrome-dark);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .progress-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0,255,255,0.1) 50%, 
      transparent 100%);
    animation: progressScan 3s ease-in-out infinite;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, 
      var(--jukebox-secondary), 
      var(--jukebox-accent));
    transition: width 0.3s ease;
    border-radius: 3px;
    box-shadow: 0 0 10px var(--jukebox-secondary);
  }

  .player-state {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .state-indicator {
    font-size: 0.9em;
    padding: var(--state-padding);
    border-radius: var(--state-border-radius);
    font-weight: 600;
    border: 1px solid transparent;
    font-family: var(--font-orbitron);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .state-indicator.playing {
    background: var(--jukebox-darker);
    color: var(--jukebox-green);
    border-color: var(--jukebox-green);
    box-shadow: 0 0 15px rgba(0,255,65,0.3);
    animation: playingPulse 2s ease-in-out infinite;
  }

  .state-indicator.paused {
    background: var(--jukebox-darker);
    color: var(--jukebox-accent);
    border-color: var(--jukebox-accent);
    box-shadow: 0 0 15px rgba(255,255,0,0.3);
  }

  .state-indicator.buffering {
    background: var(--jukebox-darker);
    color: var(--jukebox-secondary);
    border-color: var(--jukebox-secondary);
    box-shadow: 0 0 15px rgba(0,255,255,0.3);
    animation: bufferingPulse 1s ease-in-out infinite;
  }

  .state-indicator.ended,
  .state-indicator.stopped {
    background: var(--jukebox-darker);
    color: var(--jukebox-chrome-dark);
    border-color: var(--jukebox-chrome-dark);
    opacity: 0.7;
  }

  .controls {
    display: flex;
    gap: var(--spacing-sm);
  }

  .control-btn {
    background: var(--chrome-gradient);
    color: var(--jukebox-darker);
    border: 2px solid var(--jukebox-chrome-dark);
    padding: var(--control-padding);
    border-radius: var(--control-border-radius);
    cursor: pointer;
    font-size: 0.9em;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: var(--transition-standard);
    flex: 1;
    position: relative;
    overflow: hidden;
    box-shadow: var(--chrome-shadow);
    font-family: var(--font-orbitron);
  }

  .control-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: var(--transition-glow);
  }

  .control-btn:hover:not(:disabled)::before {
    left: 100%;
  }

  .control-btn:hover:not(:disabled) {
    background: var(--chrome-gradient-reverse);
    border-color: var(--jukebox-secondary);
    color: var(--jukebox-darker);
    box-shadow: 0 0 15px rgba(0,255,255,0.5), 
                0 5px 10px rgba(0,0,0,0.4);
    transform: translateY(-3px);
  }

  .control-btn:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .control-btn:disabled {
    background: var(--jukebox-chrome-dark);
    color: var(--jukebox-darker);
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .no-video {
    text-align: center;
    color: var(--jukebox-chrome-dark);
    padding: var(--spacing-lg) 0;
  }

  .no-video p {
    margin: 0 0 var(--spacing-lg) 0;
    font-size: 1.1em;
    color: var(--jukebox-secondary);
    text-shadow: 0 0 5px var(--jukebox-secondary);
  }

  .start-btn {
    width: 100%;
    margin-top: 15px;
    background: var(--neon-gradient) !important;
    color: white !important;
    border-color: var(--jukebox-primary) !important;
    box-shadow: 0 0 20px var(--jukebox-primary), var(--chrome-shadow) !important;
  }

  .start-btn:hover:not(:disabled) {
    box-shadow: 0 0 30px var(--jukebox-primary), 
                0 5px 15px rgba(0,0,0,0.4) !important;
  }

  .hint {
    font-size: 0.9em;
    font-style: italic;
    color: var(--jukebox-chrome-dark);
    opacity: 0.8;
    margin-top: 10px;
  }

  /* Component-specific animations */
  @keyframes statusBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes progressScan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes playingPulse {
    0%, 100% { box-shadow: 0 0 15px rgba(0,255,65,0.3); }
    50% { box-shadow: 0 0 25px rgba(0,255,65,0.6); }
  }

  @keyframes bufferingPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Component-specific responsive design */
  @media (max-width: 480px) {
    .current-video-info {
      --info-padding: var(--spacing-lg);
    }
    
    .controls {
      flex-direction: column;
    }
    
    .control-btn {
      flex: none;
      padding: 14px;
      font-size: 0.85em;
    }
    
    .time-info {
      font-size: 0.8em;
    }
  }
</style>