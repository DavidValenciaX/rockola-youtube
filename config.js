/**
 * Configuración de JukeTube
 * Centraliza todas las constantes y configuraciones de la aplicación
 */

(function() {
  'use strict';

  // Configuración de YouTube
  window.YOUTUBE_CONFIG = {
    // URLs base
    BASE_URL: 'https://www.youtube.com',
    WATCH_URL: 'https://www.youtube.com/watch?v=',
    EMBED_URL: 'https://www.youtube.com/embed/',
    SEARCH_URL: 'https://www.youtube.com/results?search_query=',
    
    // APIs alternativas (Invidious instances - libres y sin límites)
    INVIDIOUS_INSTANCES: [
      'https://invidious.projectsegfau.lt',
      'https://invidious.privacydev.net', 
      'https://invidious.dhusch.de',
      'https://invidious.lunar.icu'
    ],
    
    // Selectores del DOM para interactuar con YouTube
    DOM_SELECTORS: {
      // Título del video
      VIDEO_TITLE: 'h1.ytd-video-primary-info-renderer, .ytd-video-primary-info-renderer h1, .title.ytd-video-primary-info-renderer',
      
      // Controles del reproductor
      PLAY_BUTTON: '.ytp-play-button',
      PAUSE_BUTTON: '.ytp-pause-button',
      NEXT_BUTTON: '.ytp-next-button',
      PREV_BUTTON: '.ytp-prev-button',
      
      // Información del reproductor
      CURRENT_TIME: '.ytp-time-current',
      DURATION: '.ytp-time-duration',
      PLAYER_STATE: '.ytp-player-content',
      
      // Regex para extraer video ID de URL
      VIDEO_ID_FROM_URL: /[?&]v=([^&]+)/
    },
    
    // Configuración del iframe
    IFRAME_CONFIG: {
      POLLING_INTERVAL: 2000, // 2 segundos
      LOAD_TIMEOUT: 1000,     // 1 segundo
      MAX_RETRIES: 3
    }
  };

  // Configuración de la aplicación
  window.APP_CONFIG = {
    // Playlist por defecto
    DEFAULT_PLAYLIST: [
      {id: 'kRJuY6OooNWMPgEWlkAkgAIRctksFyKk1vY', title: 'La Roux - In for the Kill (Twelves Remix)'},
      {id: '45YSGFctLws', title: 'Shout Out Louds - Illusions'},
      {id: 'ktoaj1IpTbw', title: 'CHVRCHES - Gun'},
      {id: '8Zh0tY2NfLs', title: 'N.E.R.D. ft. Nelly Furtado - Hot N\' Fun (Boys Noize Remix) HQ'},
      {id: 'zwJPcRtbzDk', title: 'Daft Punk - Human After All (SebastiAn Remix)'},
      {id: 'sEwM6ERq0gc', title: 'HAIM - Forever (Official Music Video)'},
      {id: 'fTK4XTvZWmk', title: 'Housse De Racket â˜‚â˜€â˜‚ Apocalypso'}
    ],
    
    // Historial por defecto
    DEFAULT_HISTORY: [
      {id: 'XKa7Ywiv734', title: '[OFFICIAL HD] Daft Punk - Give Life Back To Music (feat. Nile Rodgers)'}
    ],
    
    // Estados del reproductor
    PLAYER_STATES: {
      STOPPED: 'stopped',
      PLAYING: 'playing',
      PAUSED: 'paused',
      SEARCHING: 'searching',
      LOADING: 'loading'
    },
    
    // Configuración de almacenamiento local
    STORAGE_KEYS: {
      PLAYLIST: 'juketube_playlist',
      HISTORY: 'juketube_history',
      SETTINGS: 'juketube_settings'
    },
    
    // Configuración de la interfaz
    UI_CONFIG: {
      ANIMATION_DURATION: 300,
      TOOLTIP_DELAY: 500,
      AUTO_SAVE_INTERVAL: 30000 // 30 segundos
    }
  };

  // Configuración de desarrollo
  window.DEV_CONFIG = {
    DEBUG_MODE: true,
    LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
    ENABLE_PERFORMANCE_LOGGING: false,
    MOCK_YOUTUBE_RESPONSES: false
  };

  // Función para obtener configuración
  window.getConfig = function(category, key) {
    var configs = {
      youtube: window.YOUTUBE_CONFIG,
      app: window.APP_CONFIG,
      dev: window.DEV_CONFIG
    };
    
    if (category && key) {
      return configs[category] && configs[category][key];
    } else if (category) {
      return configs[category];
    }
    
    return configs;
  };

  // Función para establecer configuración
  window.setConfig = function(category, key, value) {
    var configs = {
      youtube: window.YOUTUBE_CONFIG,
      app: window.APP_CONFIG,
      dev: window.DEV_CONFIG
    };
    
    if (configs[category]) {
      configs[category][key] = value;
      return true;
    }
    
    return false;
  };

  console.log('JukeTube Config: Configuración cargada');

})();
