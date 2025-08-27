<script>
  import SearchForm from './SearchForm.svelte';
</script>

<header>
  <h1>Rockola de <strong>YouTube</strong></h1>
  <SearchForm />
</header>

<style>
  header {
    background: var(--dark-gradient);
    border: 3px solid var(--jukebox-chrome);
    border-radius: 20px 20px 0 0;
    box-shadow: var(--chrome-shadow), var(--deep-shadow);
    color: var(--jukebox-chrome);
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      var(--jukebox-primary) 0%, 
      var(--jukebox-secondary) 25%, 
      var(--jukebox-accent) 50%, 
      var(--jukebox-glow) 75%, 
      var(--jukebox-primary) 100%);
    animation: neonFlow 3s ease-in-out infinite;
  }

  /* Decorative corner lights */
  header::after {
    content: '';
    position: absolute;
    top: 15px;
    right: 15px;
    width: 12px;
    height: 12px;
    background: var(--jukebox-secondary);
    border-radius: 50%;
    box-shadow: 0 0 15px var(--jukebox-secondary);
    animation: cornerGlow 2s ease-in-out infinite;
  }

  h1 {
    margin: 0;
    font-size: 2.5em;
    font-weight: bold;
    font-family: 'Orbitron', 'Montserrat', sans-serif;
    background: var(--neon-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px var(--jukebox-primary));
    animation: neonPulse 2s ease-in-out infinite alternate;
    position: relative;
  }

  h1 strong {
    background: linear-gradient(45deg, var(--jukebox-accent), var(--jukebox-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 15px var(--jukebox-accent));
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    header {
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      border-radius: 15px 15px 0 0;
    }
    
    h1 {
      font-size: 2em;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    header {
      padding: 15px;
      border-radius: 10px 10px 0 0;
      border-width: 2px;
    }
    
    h1 {
      font-size: 1.6em;
    }
  }

  /* Keyframes for animations */
  @keyframes neonFlow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes neonPulse {
    0% { 
      filter: drop-shadow(0 0 5px var(--jukebox-primary)) brightness(1); 
    }
    100% { 
      filter: drop-shadow(0 0 20px var(--jukebox-primary)) brightness(1.2); 
    }
  }

  @keyframes cornerGlow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
</style>