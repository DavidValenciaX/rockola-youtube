/**
 * Servidor HTTP para JukeTube
 * Sirve archivos estáticos y habilita CORS para evitar problemas con APIs externas
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Constantes de configuración del servidor
const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  STATIC_PATH: __dirname,
  YOUTUBE: {
    BASE_URL: 'https://www.youtube.com',
    SEARCH_URL: 'https://www.youtube.com/results',
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  }
};

const app = express();

// Configuración de CORS para permitir requests a APIs externas
const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Servir archivos estáticos desde el directorio actual
app.use(express.static(SERVER_CONFIG.STATIC_PATH));

// Ruta principal - servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(SERVER_CONFIG.STATIC_PATH, 'index.html'));
});

// Proxy para búsquedas de YouTube
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  const maxResults = req.query.max_results || 10;
  
  if (!query) {
    return res.status(400).json({ error: 'Se requiere un parámetro de búsqueda (q)' });
  }
  
  try {
    console.log(`Buscando en YouTube: "${query}"`);
    
    // Realizar la búsqueda en YouTube
    const searchUrl = SERVER_CONFIG.YOUTUBE.SEARCH_URL;
    const response = await axios.get(searchUrl, {
      params: { search_query: query },
      headers: {
        'User-Agent': SERVER_CONFIG.YOUTUBE.USER_AGENT,
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Referer': SERVER_CONFIG.YOUTUBE.BASE_URL
      }
    });
    
    // Extraer los datos JSON del script embebido en la página
    const html = response.data;
    const initialDataRegex = /var ytInitialData = (.+?);<\/script>/;
    const match = html.toString().match(initialDataRegex);
    
    if (!match?.[1]) {
      console.error('No se pudo extraer el ytInitialData de la página');
      return res.status(500).json({ error: 'Error al procesar los resultados de búsqueda' });
    }
    
    let ytData;
    try {
      ytData = JSON.parse(match[1]);
    } catch (e) {
      console.error('Error al parsear ytInitialData:', e);
      return res.status(500).json({ error: 'Error al procesar los resultados de búsqueda' });
    }
    
    // Extraer resultados de búsqueda
    const results = [];
    try {
      const contents = ytData.contents.twoColumnSearchResultsRenderer
        .primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
      
      for (const item of contents) {
        // Solo procesar resultados de video
        if (item.videoRenderer) {
          const video = item.videoRenderer;
          
          // Extraer la información del video
          const videoId = video.videoId;
          const title = video.title?.runs?.[0]?.text || 'Sin título';
          const author = video.ownerText?.runs?.[0]?.text || 'Desconocido';
          const thumbnails = video.thumbnail?.thumbnails || [];
          const viewCount = video.viewCountText?.simpleText || '0 visualizaciones';
          const duration = video.lengthText?.simpleText || '0:00';
          
          results.push({
            videoId: videoId,
            title: title,
            author: author,
            videoThumbnails: thumbnails.map(t => ({
              url: t.url,
              width: t.width,
              height: t.height
            })),
            description: viewCount,
            lengthSeconds: duration
          });
          
          // Limitar a maxResults
          if (results.length >= maxResults) break;
        }
      }
      
      console.log(`Búsqueda exitosa. Encontrados ${results.length} resultados`);
      return res.json(results);
      
    } catch (error) {
      console.error('Error al extraer resultados de búsqueda:', error);
      return res.status(500).json({ error: 'Error al procesar los resultados de búsqueda' });
    }
    
  } catch (error) {
    console.error('Error en la búsqueda de YouTube:', error.message);
    return res.status(500).json({ error: `Error en la búsqueda: ${error.message}` });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err.stack);
  res.status(500).send('Error interno del servidor');
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
  console.log(`🎵 JukeTube servidor iniciado!`);
  console.log(`📍 URL: http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}`);
  console.log(`📂 Sirviendo archivos desde: ${SERVER_CONFIG.STATIC_PATH}`);
  console.log(`🔗 CORS habilitado para APIs externas`);
  console.log('');
  console.log('Para detener el servidor presiona Ctrl+C');
});

// Manejo de cierre elegante del servidor
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor JukeTube...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servidor JukeTube...');
  process.exit(0);
});
