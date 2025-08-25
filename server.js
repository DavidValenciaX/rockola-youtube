/**
 * Servidor HTTP para JukeTube
 * Sirve archivos estáticos y habilita CORS para evitar problemas con APIs externas
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Constantes de configuración del servidor
const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  STATIC_PATH: __dirname
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
