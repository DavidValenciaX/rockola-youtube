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
  /* App.svelte specific styles - only unique styles not covered in global style.css */
  
  /* The only component-specific modification needed is ensuring YouTube container has flex layout */
  #youtube-container {
    display: flex;
    flex-direction: column;
  }
</style>