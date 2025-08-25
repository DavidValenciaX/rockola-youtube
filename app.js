var app = angular.module('JukeTubeApp', ['LocalStorageModule']);

// Config
app.config(function ($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Run - Load YouTube Iframe API
app.run(function () {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

// Constants
const YOUTUBE_CONSTANTS = {
  BASE_URL: 'https://www.youtube.com',
  WATCH_URL: 'https://www.youtube.com/watch?v=',
  EMBED_URL: 'https://www.youtube.com/embed/',
  SEARCH_ENDPOINT: 'https://www.googleapis.com/youtube/v3/search',
  // Free API alternative - using Invidious instances
  INVIDIOUS_INSTANCES: [
    'https://invidious.projectsegfau.lt',
    'https://invidious.privacydev.net',
    'https://invidious.dhusch.de'
  ]
};

// Service
app.service('YouTubeService', ['$window', '$rootScope', '$log', '$timeout', '$http', 'localStorageService', 
function ($window, $rootScope, $log, $timeout, $http, localStorageService) {

  var service = this;

  var youtube = {
    ready: false,
    player: null,
    videoId: null,
    videoTitle: null,
    state: 'stopped',
    currentTime: 0,
    duration: 0
  };

  var searchResults = [];
  var upcoming = localStorageService.get('upcoming') || [
    {id: 'kRJuY6ZDLPo', title: 'La Roux - In for the Kill (Twelves Remix)'},
    {id: '45YSGFctLws', title: 'Shout Out Louds - Illusions'},
    {id: 'ktoaj1IpTbw', title: 'CHVRCHES - Gun'},
    {id: '8Zh0tY2NfLs', title: 'N.E.R.D. ft. Nelly Furtado - Hot N Fun (Boys Noize Remix) HQ'},
    {id: 'zwJPcRtbzDk', title: 'Daft Punk - Human After All (SebastiAn Remix)'}
  ];

  var history = localStorageService.get('history') || [
    {id: 'XKa7Ywiv734', title: '[OFFICIAL HD] Daft Punk - Give Life Back To Music (feat. Nile Rodgers)'}
  ];

  // Initialize YouTube API
  $window.onYouTubeIframeAPIReady = function () {
    $log.info('YouTube Iframe API is ready');
    youtube.ready = true;
    service.createPlayer();
    $rootScope.$apply();
  };

  // YouTube player event handlers
  function onPlayerReady(event) {
    $log.info('YouTube Player is ready');
    if (history.length > 0) {
      youtube.player.cueVideoById(history[0].id);
      youtube.videoId = history[0].id;
      youtube.videoTitle = history[0].title;
      $rootScope.$apply();
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
    $rootScope.$apply();
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
    if (!youtube.player) return;
    
    youtube.player.loadVideoById(id);
    youtube.videoId = id;
    youtube.videoTitle = title;
    youtube.state = 'playing';
    $rootScope.$apply();
  };

  // Control functions
  this.play = function() {
    if (youtube.player && youtube.player.playVideo) {
      youtube.player.playVideo();
    }
  };

  this.pause = function() {
    if (youtube.player && youtube.player.pauseVideo) {
      youtube.player.pauseVideo();
    }
  };

  this.playNext = function() {
    if (upcoming.length > 0) {
      var nextVideo = upcoming.shift();
      this.playVideo(nextVideo.id, nextVideo.title);
      this.archiveVideo(nextVideo.id, nextVideo.title);
      localStorageService.set('upcoming', upcoming);
    }
  };

  this.playPrevious = function() {
    if (history.length > 1) {
      var prevVideo = history[1]; // Skip current video
      this.playVideo(prevVideo.id, prevVideo.title);
    }
  };

  // Search videos using Invidious API (free alternative)
  this.searchVideos = function(query, callback) {
    if (!query) return;

    var searchUrl = YOUTUBE_CONSTANTS.INVIDIOUS_INSTANCES[0] + '/api/v1/search';
    
    $http.get(searchUrl, {
      params: {
        q: query,
        type: 'video',
        max_results: 10
      }
    }).then(function(response) {
      var results = response.data.map(function(item) {
        return {
          id: item.videoId,
          title: item.title,
          author: item.author,
          thumbnail: item.videoThumbnails && item.videoThumbnails[0] ? 
                    item.videoThumbnails[0].url : 
                    'https://i.ytimg.com/vi/' + item.videoId + '/default.jpg',
          description: item.description || '',
          duration: item.lengthSeconds
        };
      });
      
      searchResults.length = 0;
      Array.prototype.push.apply(searchResults, results);
      
      if (callback) callback(results);
      $rootScope.$apply();
      
    }, function(error) {
      $log.error('Search error:', error);
      // Fallback to next Invidious instance or show error
      service.tryNextInvidiousInstance(query, callback, 1);
    });
  };

  // Try next Invidious instance if current one fails
  this.tryNextInvidiousInstance = function(query, callback, instanceIndex) {
    if (instanceIndex >= YOUTUBE_CONSTANTS.INVIDIOUS_INSTANCES.length) {
      $log.error('All Invidious instances failed');
      if (callback) callback([]);
      return;
    }

    var searchUrl = YOUTUBE_CONSTANTS.INVIDIOUS_INSTANCES[instanceIndex] + '/api/v1/search';
    
    $http.get(searchUrl, {
      params: {
        q: query,
        type: 'video',
        max_results: 10
      }
    }).then(function(response) {
      var results = response.data.map(function(item) {
        return {
          id: item.videoId,
          title: item.title,
          author: item.author,
          thumbnail: item.videoThumbnails && item.videoThumbnails[0] ? 
                    item.videoThumbnails[0].url : 
                    'https://i.ytimg.com/vi/' + item.videoId + '/default.jpg',
          description: item.description || '',
          duration: item.lengthSeconds
        };
      });
      
      searchResults.length = 0;
      Array.prototype.push.apply(searchResults, results);
      
      if (callback) callback(results);
      $rootScope.$apply();
      
    }, function(error) {
      $log.error('Search error with instance ' + instanceIndex + ':', error);
      // Try next instance
      service.tryNextInvidiousInstance(query, callback, instanceIndex + 1);
    });
  };

  // Playlist management
  this.queueVideo = function (id, title) {
    var video = { id: id, title: title };
    upcoming.push(video);
    localStorageService.set('upcoming', upcoming);
    return upcoming;
  };

  this.archiveVideo = function (id, title) {
    var video = { id: id, title: title };
    history.unshift(video);
    if (history.length > 50) { // Limit history to 50 items
      history = history.slice(0, 50);
    }
    localStorageService.set('history', history);
    return history;
  };

  this.deleteVideo = function (list, id) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].id === id) {
        list.splice(i, 1);
        break;
      }
    }
    // Update localStorage
    if (list === upcoming) {
      localStorageService.set('upcoming', upcoming);
    } else if (list === history) {
      localStorageService.set('history', history);
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

  this.getHistory = function () {
    return history;
  };

}]);

// Controller
app.controller('VideosController', function ($scope, $log, $timeout, YouTubeService) {

  init();

  function init() {
    $scope.youtube = YouTubeService.getYoutube();
    $scope.searchResults = YouTubeService.getSearchResults();
    $scope.upcoming = YouTubeService.getUpcoming();
    $scope.history = YouTubeService.getHistory();
    $scope.playlist = true;
    $scope.query = '';
    
    // Initialize player after a short delay
    $timeout(function() {
      if (!$scope.youtube.ready) {
        // If API not ready yet, wait a bit more
        $timeout(init, 1000);
      }
    }, 500);
  }

  $scope.launch = function (id, title) {
    YouTubeService.playVideo(id, title);
    YouTubeService.archiveVideo(id, title);
    YouTubeService.deleteVideo($scope.upcoming, id);
    $log.info('Launched: ' + title);
  };

  $scope.queue = function (id, title) {
    YouTubeService.queueVideo(id, title);
    YouTubeService.deleteVideo($scope.history, id);
    $log.info('Queued: ' + title);
  };

  $scope.delete = function (listName, id) {
    var list = listName === 'upcoming' ? $scope.upcoming : $scope.history;
    YouTubeService.deleteVideo(list, id);
  };

  $scope.search = function () {
    if ($scope.query && $scope.query.trim()) {
      $log.info('Searching for: ' + $scope.query);
      YouTubeService.searchVideos($scope.query.trim(), function(results) {
        $log.info('Search completed. Found ' + results.length + ' results');
      });
    }
  };

  $scope.tabulate = function (state) {
    $scope.playlist = state;
  };

  // Control functions
  $scope.togglePlay = function() {
    if ($scope.youtube.state === 'playing') {
      YouTubeService.pause();
    } else {
      YouTubeService.play();
    }
  };

  $scope.pause = function() {
    YouTubeService.pause();
  };

  $scope.nextVideo = function() {
    YouTubeService.playNext();
  };

  $scope.prevVideo = function() {
    YouTubeService.playPrevious();
  };

  $scope.addToPlaylist = function() {
    if ($scope.youtube.videoId && $scope.youtube.videoTitle) {
      YouTubeService.queueVideo($scope.youtube.videoId, $scope.youtube.videoTitle);
      $log.info('Added to playlist: ' + $scope.youtube.videoTitle);
    }
  };

  $scope.removeFromPlaylist = function() {
    if ($scope.youtube.videoId) {
      YouTubeService.deleteVideo($scope.upcoming, $scope.youtube.videoId);
      YouTubeService.deleteVideo($scope.history, $scope.youtube.videoId);
      $log.info('Removed from playlist: ' + $scope.youtube.videoTitle);
    }
  };

});