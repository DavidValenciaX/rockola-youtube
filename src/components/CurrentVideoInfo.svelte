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

<div id="current-video-info">
  <h3>Reproduciendo Ahora</h3>
  
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
  #current-video-info {
    margin-bottom: 25px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-weight: 500;
    font-size: 1.1em;
  }

  .video-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .video-title {
    margin: 0;
    font-weight: 500;
    color: #333;
    line-height: 1.4;
    font-size: 0.95em;
  }

  .progress-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .time-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.85em;
    color: #666;
    font-family: monospace;
  }

  .progress-bar {
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
    border-radius: 3px;
  }

  .player-state {
    display: flex;
    align-items: center;
  }

  .state-indicator {
    font-size: 0.85em;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
  }

  .state-indicator.playing {
    background-color: #e8f5e8;
    color: #2e7d32;
  }

  .state-indicator.paused {
    background-color: #fff3e0;
    color: #f57c00;
  }

  .state-indicator.buffering {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  .state-indicator.ended,
  .state-indicator.stopped {
    background-color: #fafafa;
    color: #757575;
  }

  .controls {
    display: flex;
    gap: 10px;
  }

  .control-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85em;
    font-weight: 500;
    transition: all 0.3s ease;
    flex: 1;
  }

  .control-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  .control-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .no-video {
    text-align: center;
    color: #666;
  }

  .no-video p {
    margin: 0 0 15px 0;
  }

  .start-btn {
    width: 100%;
    margin-top: 10px;
  }

  .hint {
    font-size: 0.85em;
    font-style: italic;
    color: #999;
  }

  @media (max-width: 480px) {
    .controls {
      flex-direction: column;
    }
    
    .control-btn {
      flex: none;
    }
  }
</style>