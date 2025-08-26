const app = angular.module('RocolaYouTubeApp', ['LocalStorageModule']);

// Config
app.config(function ($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Run - Load YouTube Iframe API
app.run(function () {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

// Constants
const YOUTUBE_CONSTANTS = {
  BASE_URL: 'https://www.youtube.com',
  WATCH_URL: 'https://www.youtube.com/watch?v=',
  EMBED_URL: 'https://www.youtube.com/embed/',
  SEARCH_ENDPOINT: '/api/search' // Endpoint local del servidor
};

// Storage keys
const STORAGE_KEYS = {
  UPCOMING: 'upcoming',
  CURRENT_VIDEO: 'current_video'
};

// Service
app.service('YouTubeService', ['$window', '$rootScope', '$log', '$timeout', '$http', 'localStorageService', 
function ($window, $rootScope, $log, $timeout, $http, localStorageService) {

  const service = this;

  const youtube = {
    ready: false,
    player: null,
    videoId: null,
    videoTitle: null,
    state: 'stopped',
    currentTime: 0,
    duration: 0
  };

  let searchResults = [];
  let upcoming = localStorageService.get(STORAGE_KEYS.UPCOMING) || [];
  let pendingPlay = null;



  // Initialize YouTube API
  $window.onYouTubeIframeAPIReady = function () {
    $log.info('YouTube Iframe API is ready');
    youtube.ready = true;
    service.createPlayer();
    
    // Solo aplicar si no hay un ciclo de digest en progreso
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  };

  // YouTube player event handlers
  function onPlayerReady(event) {
    $log.info('YouTube Player is ready');
    // Si hay una reproducción pendiente, darle prioridad
    if (pendingPlay?.id) {
      try {
        youtube.player.loadVideoById(pendingPlay.id);
        youtube.videoId = pendingPlay.id;
        youtube.videoTitle = pendingPlay.title;
        youtube.state = 'playing';
        localStorageService.set(STORAGE_KEYS.CURRENT_VIDEO, { id: pendingPlay.id, title: pendingPlay.title });
      } catch (e) {
        $log.warn('No se pudo iniciar la reproducción pendiente:', e);
      } finally {
        pendingPlay = null;
      }
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
      return;
    }

    // Restaurar el video actual si existe
    const current = localStorageService.get(STORAGE_KEYS.CURRENT_VIDEO);
    if (current?.id) {
      try {
        youtube.player.cueVideoById(current.id);
        youtube.videoId = current.id;
        youtube.videoTitle = current.title;
        youtube.state = 'paused';
      } catch (e) {
        $log.warn('No se pudo restaurar el video actual:', e);
      }
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    }
  }

  function onPlayerStateChange(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        youtube.state = 'playing';
        break;
      case YT.PlayerState.PAUSED:
        youtube.state = 'paused';
        break;
      case YT.PlayerState.ENDED:
        youtube.state = 'ended';
        service.playNext();
        break;
      case YT.PlayerState.BUFFERING:
        youtube.state = 'buffering';
        break;
      default:
        youtube.state = 'stopped';
    }
    
    // Solo aplicar si no hay un ciclo de digest en progreso
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  }

  // Create YouTube player
  this.createPlayer = function () {
    if (!youtube.ready) return;
    
    youtube.player = new YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      playerVars: {
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        fs: 1,
        cc_load_policy: 0,
        iv_load_policy: 3,
        autohide: 0
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  // Play specific video
  this.playVideo = function (id, title) {
    if (!youtube.player) {
      // Aplazar reproducción hasta que el reproductor esté listo
      pendingPlay = { id: id, title: title };
      youtube.videoId = id;
      youtube.videoTitle = title;
      youtube.state = 'loading';
      localStorageService.set(STORAGE_KEYS.CURRENT_VIDEO, { id: id, title: title });
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
      return;
    }
    
    youtube.player.loadVideoById(id);
    youtube.videoId = id;
    youtube.videoTitle = title;
    youtube.state = 'playing';
    // Persistir el video actual
    localStorageService.set(STORAGE_KEYS.CURRENT_VIDEO, { id: id, title: title });
    
    // Solo aplicar si no hay un ciclo de digest en progreso
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  };

  // Control functions
  this.play = function() {
    if (youtube.player?.playVideo) {
      youtube.player.playVideo();
    }
  };

  this.pause = function() {
    if (youtube.player?.pauseVideo) {
      youtube.player.pauseVideo();
    }
  };

  this.playNext = function() {
    if (upcoming.length > 0) {
      const nextVideo = upcoming.shift();
      this.playVideo(nextVideo.id, nextVideo.title);
      localStorageService.set(STORAGE_KEYS.UPCOMING, upcoming);
    }
  };



  // Search videos using our proxy to YouTube web
  this.searchVideos = function(query, callback) {
    if (!query) return;

    const proxyUrl = YOUTUBE_CONSTANTS.SEARCH_ENDPOINT;
    
    $http.get(proxyUrl, {
      params: {
        q: query,
        max_results: 10
      }
    }).then(function(response) {
      const results = response.data.map(function(item) {
        return {
          id: item.videoId,
          title: item.title,
          author: item.author,
          thumbnail: item.videoThumbnails?.[0]?.url || 
                    'https://i.ytimg.com/vi/' + item.videoId + '/default.jpg',
          description: item.description || '',
          duration: item.lengthSeconds
        };
      });
      
      searchResults.length = 0;
      Array.prototype.push.apply(searchResults, results);
      
      if (callback) callback(results);
      if (!$rootScope.$$phase) $rootScope.$apply();
      
    }, function(error) {
      $log.error('Search error:', error);
      if (callback) callback([]);
    });
  };

  // Método obsoleto - mantenido para compatibilidad
  this.tryNextInvidiousInstance = function(query, callback, instanceIndex) {
    $log.warn('tryNextInvidiousInstance está obsoleto - usando proxy del servidor');
    this.searchVideos(query, callback);
  };

  // Playlist management
  this.queueVideo = function (id, title) {
    const video = { id: id, title: title };
    upcoming.push(video);
    localStorageService.set(STORAGE_KEYS.UPCOMING, upcoming);
    return upcoming;
  };



  this.deleteVideo = function (list, id) {
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].id === id) {
        list.splice(i, 1);
        break;
      }
    }
    // Update localStorage
    if (list === upcoming) {
      localStorageService.set(STORAGE_KEYS.UPCOMING, upcoming);
    }
  };

  // Getters
  this.getYoutube = function () {
    return youtube;
  };

  this.getSearchResults = function() {
    return searchResults;
  };

  this.getUpcoming = function () {
    return upcoming;
  };



}]);

// Controller
app.controller('VideosController', function ($scope, $log, $timeout, YouTubeService) {

  init();

  function init() {
    $scope.youtube = YouTubeService.getYoutube();
    $scope.searchResults = YouTubeService.getSearchResults();
    $scope.upcoming = YouTubeService.getUpcoming();
    $scope.query = '';
    
    // Initialize player after a short delay
    $timeout(function() {
      if (!$scope.youtube.ready) {
        // If API not ready yet, wait a bit more
        $timeout(init, 1000);
      }
    }, 500);
  }

  // Función launch eliminada - Las canciones se reproducen solo en orden usando playNext()

  $scope.startPlaylist = function() {
    if ($scope.upcoming.length > 0 && !$scope.youtube.videoId) {
      YouTubeService.playNext();
      $log.info('Started playlist from beginning');
    }
  };

  $scope.queue = function (id, title) {
    YouTubeService.queueVideo(id, title);
    $log.info('Queued: ' + title);
  };

  $scope.delete = function (listName, id) {
    if (listName === 'upcoming') {
      YouTubeService.deleteVideo($scope.upcoming, id);
    }
  };

  $scope.search = function () {
    if ($scope.query?.trim()) {
      $log.info('Searching for: ' + $scope.query);
      YouTubeService.searchVideos($scope.query.trim(), function(results) {
        $log.info('Search completed. Found ' + results.length + ' results');
      });
    }
  };

  // Selección de resultado de búsqueda: reproducir de inmediato si no hay actual ni cola
  $scope.selectSearchResult = function(video) {
    const hasCurrent = !!$scope.youtube.videoId;
    const hasQueue = ($scope.upcoming && $scope.upcoming.length > 0);
    if (!hasCurrent && !hasQueue) {
      YouTubeService.playVideo(video.id, video.title);
      $log.info('Playing now: ' + video.title);
    } else {
      YouTubeService.queueVideo(video.id, video.title);
      $log.info('Queued: ' + video.title);
    }
  };



  // Control functions
  $scope.togglePlay = function() {
    if ($scope.youtube.state === 'playing') {
      YouTubeService.pause();
    } else if ($scope.youtube.videoId) {
      // Si hay un video cargado, continuar reproducción
      YouTubeService.play();
    } else if ($scope.upcoming.length > 0) {
      // Si no hay video pero hay canciones en la playlist, iniciar desde el principio
      YouTubeService.playNext();
      $log.info('Started playlist from beginning');
    }
  };

  $scope.pause = function() {
    YouTubeService.pause();
  };

  $scope.nextVideo = function() {
    YouTubeService.playNext();
  };
});