<script>
  import SearchForm from './SearchForm.svelte';
</script>

<header>
  <h1>Rockola de <strong>YouTube</strong></h1>
  <SearchForm />
</header>

<style>
  header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  h1 {
    margin: 0;
    font-size: 2em;
    font-weight: 300;
  }

  h1 strong {
    font-weight: 600;
  }

  @media (max-width: 768px) {
    header {
      flex-direction: column;
      gap: 15px;
    }
    
    h1 {
      font-size: 1.5em;
    }
  }
</style>