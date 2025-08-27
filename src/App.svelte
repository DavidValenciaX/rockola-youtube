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
    <YoutubePlayer />
    <SearchResults />
  </div>
  
  <!-- Control Panel -->
  <div id="control-panel">
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
  :global(:root) {
    /* Jukebox Color Palette */
    --jukebox-primary: #ff0040;        /* Bright neon red */
    --jukebox-secondary: #00ffff;      /* Cyan neon */
    --jukebox-accent: #ffff00;         /* Yellow neon */
    --jukebox-chrome: #e8e8e8;         /* Chrome silver */
    --jukebox-chrome-dark: #a0a0a0;    /* Dark chrome */
    --jukebox-dark: #1a1a2e;           /* Deep dark blue */
    --jukebox-darker: #0f0f1a;         /* Even darker */
    --jukebox-glow: #ff6b9d;           /* Pink glow */
    --jukebox-purple: #8a2be2;         /* Electric purple */
    --jukebox-orange: #ff4500;         /* Electric orange */
    --jukebox-green: #00ff41;          /* Electric green */
    
    /* Gradients */
    --chrome-gradient: linear-gradient(145deg, #f0f0f0 0%, #c0c0c0 50%, #a0a0a0 100%);
    --chrome-gradient-reverse: linear-gradient(145deg, #a0a0a0 0%, #c0c0c0 50%, #f0f0f0 100%);
    --neon-gradient: linear-gradient(145deg, var(--jukebox-primary), var(--jukebox-glow));
    --dark-gradient: linear-gradient(145deg, var(--jukebox-dark), var(--jukebox-darker));
    
    /* Shadows and Effects */
    --neon-glow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
    --chrome-shadow: 0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8);
    --deep-shadow: 0 8px 32px rgba(0,0,0,0.6);
  }

  :global(body) {
    margin: 0;
    padding: 0;
    background: var(--dark-gradient);
    background-attachment: fixed;
    min-height: 100vh;
    font-family: 'Orbitron', 'Montserrat', sans-serif;
    color: var(--jukebox-chrome);
    overflow-x: hidden;
  }

  #main-container {
    display: flex;
    margin: 20px auto;
    max-width: 1400px;
    min-height: 800px;
    background: var(--dark-gradient);
    border: 4px solid var(--jukebox-chrome);
    border-radius: 25px;
    box-shadow: var(--chrome-shadow), var(--deep-shadow);
    padding: 20px;
    gap: 25px;
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
    border-radius: 20px;
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

  #youtube-container {
    flex: 2;
    display: flex;
    flex-direction: column;
    background: var(--jukebox-darker);
    border: 3px solid var(--jukebox-chrome);
    border-radius: 20px;
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

  #control-panel {
    flex: 1;
    min-width: 350px;
    background: var(--chrome-gradient);
    border: 3px solid var(--jukebox-chrome);
    border-radius: 20px;
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

  footer {
    background: var(--dark-gradient);
    border: 2px solid var(--jukebox-chrome);
    border-radius: 0 0 20px 20px;
    color: var(--jukebox-chrome);
    text-align: center;
    padding: 20px;
    font-size: 0.9em;
    box-shadow: var(--chrome-shadow);
    margin-top: 20px;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  footer a {
    color: var(--jukebox-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
  }

  footer a:hover {
    color: var(--jukebox-accent);
    text-shadow: 0 0 5px var(--jukebox-accent);
  }

  /* Keyframes for animations */
  @keyframes cornerGlow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes controlPanelGlow {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    #main-container {
      max-width: 95%;
      margin: 15px auto;
      padding: 15px;
      gap: 20px;
    }
    
    #control-panel {
      min-width: 300px;
    }
    
    footer {
      max-width: 95%;
    }
  }

  @media (max-width: 968px) {
    #main-container {
      flex-direction: column;
      max-width: 95%;
      padding: 15px;
    }
    
    #youtube-container {
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
    
    footer {
      border-radius: 0 0 15px 15px;
      margin-top: 10px;
    }
  }

  @media (max-width: 480px) {
    #main-container {
      margin: 5px;
      padding: 8px;
      border-radius: 10px;
      border-width: 2px;
    }
    
    footer {
      border-radius: 0 0 10px 10px;
      border-width: 2px;
      font-size: 0.8em;
      padding: 15px;
      margin: 5px;
    }
  }
</style>