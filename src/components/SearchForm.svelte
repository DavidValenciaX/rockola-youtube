<script>
  import { searchQuery, isSearching, searchActions } from '../stores/search.js';

  let queryValue = '';

  // Subscribe to search query to keep input in sync
  searchQuery.subscribe(value => {
    queryValue = value;
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (queryValue.trim()) {
      searchActions.performSearch(queryValue.trim());
    }
  }

  function handleInput(event) {
    queryValue = event.target.value;
  }
</script>

<form id="search" on:submit={handleSubmit}>
  <input 
    id="query" 
    name="q" 
    type="text" 
    placeholder="Buscar un video de YouTube" 
    value={queryValue}
    on:input={handleInput}
    disabled={$isSearching}
  >
  <button type="submit" id="submit" disabled={$isSearching || !queryValue.trim()}>
    {#if $isSearching}
      <span class="loading">⏳</span>
    {:else}
      🔍
    {/if}
  </button>
</form>

<style>
  /* SearchForm Component - Fully Self-Contained Styles */
  
  #search {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
    position: relative;
  }

  #query {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: 2px solid var(--jukebox-chrome);
    border-radius: var(--border-radius-pill);
    font-size: 1em;
    width: 350px;
    outline: none;
    background: var(--chrome-gradient);
    color: var(--jukebox-darker);
    font-weight: 500;
    box-shadow: var(--chrome-shadow);
    transition: var(--transition-standard);
    font-family: var(--font-base);
  }

  #query::placeholder {
    color: var(--jukebox-darker);
    opacity: 0.7;
    font-style: italic;
  }

  #query:focus {
    border-color: var(--jukebox-secondary);
    background: var(--chrome-gradient-reverse);
    box-shadow: 0 0 15px rgba(0,255,255,0.5), var(--chrome-shadow);
    transform: translateY(-1px);
  }

  #query:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--jukebox-chrome-dark);
  }

  #submit {
    background: var(--neon-gradient);
    border: 2px solid var(--jukebox-chrome);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.3em;
    transition: var(--transition-standard);
    box-shadow: var(--chrome-shadow),
                0 0 10px var(--jukebox-primary);
    position: relative;
    overflow: hidden;
  }

  #submit::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: var(--transition-glow);
  }

  #submit:hover:not(:disabled)::before {
    left: 100%;
  }

  #submit:hover:not(:disabled) {
    border-color: var(--jukebox-secondary);
    box-shadow: 0 0 20px var(--jukebox-secondary),
                0 0 30px var(--jukebox-primary),
                var(--chrome-shadow);
    transform: scale(1.1) translateY(-2px);
  }

  #submit:active:not(:disabled) {
    transform: scale(1.05) translateY(-1px);
  }

  #submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    background: var(--jukebox-chrome-dark);
    box-shadow: var(--chrome-shadow);
  }

  .loading {
    animation: jukeboxSpin 1s linear infinite;
    color: var(--jukebox-accent);
    filter: drop-shadow(0 0 5px var(--jukebox-accent));
  }

  /* Responsive Design - Component-specific breakpoints */
  @media (max-width: 768px) {
    #query {
      width: 280px;
      font-size: 0.9em;
      padding: 10px 18px;
    }
    
    #submit {
      width: 45px;
      height: 45px;
      font-size: 1.1em;
    }
  }

  @media (max-width: 480px) {
    #search {
      gap: 10px;
    }
    
    #query {
      width: 220px;
      font-size: 0.85em;
      padding: 10px 15px;
    }
    
    #submit {
      width: 40px;
      height: 40px;
      font-size: 1em;
    }
  }
</style>