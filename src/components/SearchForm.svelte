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
  #search {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  #query {
    padding: 10px 15px;
    border: none;
    border-radius: 25px;
    font-size: 1em;
    width: 300px;
    outline: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  #query:focus {
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  #query:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  #submit {
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2em;
    transition: all 0.3s ease;
  }

  #submit:hover:not(:disabled) {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.5);
    transform: scale(1.05);
  }

  #submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .loading {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    #query {
      width: 250px;
      font-size: 0.9em;
    }
  }

  @media (max-width: 480px) {
    #query {
      width: 200px;
    }
  }
</style>