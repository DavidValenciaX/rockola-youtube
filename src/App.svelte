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
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
  }

  #main-container {
    display: flex;
    min-height: calc(100vh - 120px);
  }

  #youtube-container {
    flex: 2;
    display: flex;
    flex-direction: column;
  }

  #control-panel {
    flex: 1;
    background-color: #f5f5f5;
    padding: 20px;
    min-width: 300px;
  }

  footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 20px;
    font-size: 0.9em;
  }

  footer a {
    color: #4CAF50;
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    #main-container {
      flex-direction: column;
    }
    
    #control-panel {
      min-width: auto;
    }
  }
</style>