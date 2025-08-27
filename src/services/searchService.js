// Search service to handle YouTube video search via Express backend
export const searchService = {
  SEARCH_ENDPOINT: '/api/search',

  async searchVideos(query, maxResults = 10) {
    if (!query || !query.trim()) {
      throw new Error('Search query is required');
    }

    try {
      const url = new URL(this.SEARCH_ENDPOINT, window.location.origin);
      url.searchParams.append('q', query.trim());
      url.searchParams.append('max_results', maxResults.toString());

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the data to match the expected format
      return data.map(item => ({
        id: item.videoId,
        title: item.title,
        author: item.author,
        thumbnail: item.videoThumbnails?.[0]?.url || 
                  `https://i.ytimg.com/vi/${item.videoId}/default.jpg`,
        description: item.description || '',
        duration: item.lengthSeconds // This is actually a formatted string like "3:45"
      }));

    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
};