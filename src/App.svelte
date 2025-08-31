<script>
  import Header from './components/Header.svelte';
  import SearchForm from './components/SearchForm.svelte';
  import YoutubePlayer from './components/YoutubePlayer.svelte';
  import SearchResults from './components/SearchResults.svelte';
  import CurrentVideoInfo from './components/CurrentVideoInfo.svelte';
  import Playlist from './components/Playlist.svelte';
</script>

<Header />

<div id="main-container">
  <!-- YouTube Player Container -->
  <div id="youtube-container">
    <SearchResults />
  </div>
  
  <!-- Control Panel -->
  <div id="control-panel">
    <YoutubePlayer />
    <CurrentVideoInfo />
    <Playlist />
  </div>
</div>

<footer>
  <em>Concept &amp; Design original: <a href="https://jgthms.com">J. Thomas</a></em><br>
  Basado en <a href="https://github.com/jgthms/juketube">JukeTube</a>, modificado por <strong><a target="_blank" rel="noopener" href="https://github.com/DavidValenciaX">David Valencia</a></strong>.<br>
  Código fuente disponible en <a href="https://github.com/DavidValenciaX/rockola-youtube">GitHub</a>.
</footer>

<style>
  /* App.svelte - Main Layout Container Styles */
  
  /* Jukebox Cabinet Main Container */
  #main-container { 
    display: flex;
    margin: var(--spacing-lg) auto;
    min-height: 800px;
    background: var(--dark-gradient);
    border: 4px solid var(--jukebox-chrome);
    border-radius: var(--border-radius-large);
    box-shadow: var(--chrome-shadow), var(--deep-shadow);
    padding: var(--spacing-lg);
    gap: var(--spacing-xl);
    position: relative;
    overflow: hidden;
  }

  #main-container::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 2px solid var(--jukebox-chrome-dark);
    border-radius: var(--border-radius-large);
    pointer-events: none;
  }

  /* Decorative corner elements */
  #main-container::after {
    content: '';
    position: absolute;
    top: 15px;
    right: 15px;
    width: 30px;
    height: 30px;
    background: radial-gradient(circle, var(--jukebox-secondary), transparent);
    border-radius: 50%;
    animation: cornerGlow 3s ease-in-out infinite;
  }

  /* Jukebox Screen Container */
  #youtube-container { 
    flex: 2;
    display: flex;
    flex-direction: column;
    background: var(--jukebox-darker);
    border: 3px solid var(--jukebox-chrome);
    border-radius: var(--border-radius-large);
    overflow: hidden;
    box-shadow: var(--chrome-shadow), 
                inset 0 0 20px rgba(0,255,255,0.1);
    position: relative;
  }

  #youtube-container::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border: 1px solid var(--jukebox-secondary);
    border-radius: 15px;
    pointer-events: none;
    box-shadow: 0 0 15px var(--jukebox-secondary);
    z-index: 1;
  }

  /* Jukebox Control Panel */
  #control-panel { 
    flex: 1;
    min-width: 350px;
    background: var(--chrome-gradient);
    border: 3px solid var(--jukebox-chrome);
    border-radius: var(--border-radius-large);
    box-shadow: var(--chrome-shadow), var(--deep-shadow);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  #control-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      var(--jukebox-primary), 
      var(--jukebox-accent), 
      var(--jukebox-secondary));
    animation: controlPanelGlow 2s ease-in-out infinite;
  }

  /* Footer Styles */
  footer { 
    background: var(--dark-gradient);
    border: 2px solid var(--jukebox-chrome);
    border-radius: 0 0 var(--border-radius-large) var(--border-radius-large);
    color: var(--jukebox-chrome);
    font-size: 14px;
    padding: var(--spacing-lg);
    text-align: center;
    box-shadow: var(--chrome-shadow);
    margin-top: var(--spacing-lg);
  }

  footer em { 
    display: block;
    font-style: normal;
    margin-bottom: 5px;
  }

  footer a { 
    color: var(--jukebox-secondary);
    text-decoration: none;
    transition: var(--transition-standard);
  }

  footer a:hover { 
    color: var(--jukebox-accent);
    text-shadow: 0 0 5px var(--jukebox-accent);
  }

  /* Responsive Design for Main Layout */
  @media (max-width: 1200px) {
    #main-container { 
      max-width: 95%;
      margin: 15px auto;
      padding: 15px;
      gap: var(--spacing-lg);
    }
    
    #control-panel {
      min-width: 300px;
    }
  }

  @media (max-width: 968px) {
    #main-container { 
      flex-direction: column;
      height: auto;
      max-width: 95%;
      padding: 15px;
    }
    
    #youtube-container { 
      height: 500px;
      order: 1;
    }
    
    #control-panel { 
      width: 100%;
      min-width: auto;
      order: 2;
    }
  }

  @media (max-width: 768px) {
    #main-container {
      margin: 10px auto;
      padding: 10px;
      border-radius: 15px;
    }
  }

  @media (max-width: 480px) {
    #main-container {
      margin: 5px;
      padding: var(--spacing-xs);
      border-radius: 10px;
      border-width: 2px;
    }
    
    footer {
      border-radius: 0 0 10px 10px;
      border-width: 2px;
      font-size: 12px;
      padding: 15px;
    }
  }
</style>