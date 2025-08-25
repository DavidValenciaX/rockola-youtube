# JukeTube - YouTube Web Interface

Una aplicación de música que utiliza la interfaz web oficial de YouTube para reproducir videos, similar a YouTube Music Desktop.

## 🎵 Características

- **Interfaz Web de YouTube**: Usa la interfaz oficial de YouTube en lugar de APIs
- **Reproducción Directa**: Acceso completo a todas las funciones de YouTube
- **Playlist Personal**: Gestiona tu propia lista de reproducción
- **Búsqueda Integrada**: Busca videos directamente en YouTube
- **Controles de Reproducción**: Play, pause, siguiente, anterior
- **Historial**: Mantiene un registro de videos reproducidos
- **Diseño Responsivo**: Funciona en diferentes tamaños de pantalla

## 🚀 Cómo Funciona

### Enfoque Híbrido Inteligente

Esta aplicación utiliza una **estrategia híbrida** que combina lo mejor de ambos mundos:

1. **YouTube Embed API**: Usa el reproductor oficial embebido (permitido por YouTube)
2. **API Invidious**: Utiliza APIs libres y sin límites para búsquedas
3. **Almacenamiento Local**: Guarda playlists y configuración en el navegador
4. **Interfaz Personalizada**: Control total sobre la experiencia de usuario

### Ventajas de este Enfoque

✅ **Reproductor Oficial**: Usa el reproductor embebido oficial de YouTube  
✅ **Búsqueda Sin Límites**: APIs libres sin cuotas ni restricciones  
✅ **Funcionalidad Completa**: Acceso a todas las características de reproducción  
✅ **Persistencia Local**: Guarda playlists y configuración localmente  
✅ **Sin Bloqueos**: Evita las restricciones de X-Frame-Options  
✅ **Estable**: Combinación robusta de tecnologías probadas  

## 🛠️ Tecnologías Utilizadas

- **AngularJS**: Framework frontend
- **YouTube Embed API**: Reproductor oficial embebido
- **Invidious API**: Búsqueda libre sin límites
- **LocalStorage**: Persistencia de datos local
- **JavaScript**: Lógica de aplicación y comunicación con APIs
- **CSS3**: Diseño moderno y responsivo

## 📁 Estructura del Proyecto

```bash
juketube/
├── index.html              # Página principal
├── app.js                  # Lógica de la aplicación AngularJS
├── youtube-iframe-handler.js # Manejador del iframe de YouTube
├── style.css               # Estilos CSS
├── angular.min.js          # AngularJS framework
├── angular-local-storage.js # Plugin de almacenamiento local
└── README.md               # Este archivo
```

## 🎮 Funcionalidades

### Reproducción de Videos

- Haz clic en cualquier video de la playlist para reproducirlo
- Usa los controles de reproducción (play, pause, siguiente, anterior)
- El video se reproduce directamente en la interfaz de YouTube

### Gestión de Playlist

- **Upcoming**: Videos en cola para reproducir
- **History**: Videos ya reproducidos
- Añade videos a la playlist con el botón "Add to Playlist"
- Elimina videos con el botón "delete"

### Búsqueda

- Busca videos directamente en YouTube
- Los resultados aparecen en la interfaz web de YouTube
- Haz clic en cualquier video para reproducirlo

## 🔧 Instalación y Uso

### Requisitos

- **Node.js**: Versión 18.11.0 o superior (necesario para el modo de desarrollo con `--watch`)

### Instalación

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/tu-usuario/juketube.git
   cd juketube
   ```

2. **Instala las dependencias**:

   ```bash
   npm install
   ```

### Uso Recomendado (Servidor HTTP)

**⚠️ Importante**: Para evitar problemas de CORS con las APIs de búsqueda, es recomendable usar el servidor HTTP incluido:

```bash
# Iniciar servidor en modo producción
npm start

# Iniciar servidor en modo desarrollo con auto-recarga (Node.js ≥18.11.0)
npm run dev
```

Luego visita: **<http://localhost:3000>**

### Uso Alternativo (Archivo Local)

También puedes abrir directamente el archivo:

- Abre `index.html` en tu navegador web
- **Nota**: Algunas funciones de búsqueda pueden no funcionar debido a restricciones CORS

### Otros servidores locales

Si prefieres usar otros servidores:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -S SimpleHTTPServer 8000

# Node.js (live-server)
npx live-server

# PHP
php -S localhost:8000
```

### Disfruta de la música

- La aplicación cargará con una playlist por defecto
- Usa la barra de búsqueda para encontrar videos
- Gestiona tu playlist con los controles de la interfaz
- Los videos se reproducen usando el reproductor oficial de YouTube

## 🎯 Limitaciones

❌ **Dependiente de la interfaz web**: Si YouTube cambia drásticamente la interfaz, puede romper funcionalidades  
❌ **Sin acceso directo a datos**: No puede acceder directamente a metadatos o streams de audio  
❌ **Limitado por la web**: Solo puede hacer lo que la interfaz web permite  
❌ **Políticas CORS**: Algunas funcionalidades pueden estar limitadas por las políticas de seguridad del navegador  

## 🔄 Comparación con la Versión Anterior

| Característica | Versión API | Versión Web Interface |
|----------------|-------------|----------------------|
| **Dependencias** | API Key de YouTube | Ninguna |
| **Límites** | Cuotas de API | Sin límites |
| **Actualizaciones** | Manual | Automática |
| **Funcionalidad** | Limitada | Completa |
| **Estabilidad** | Propensa a cambios de API | Más estable |

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**J. Thomas** - [GitHub](https://github.com/jgthms)

## 🙏 Agradecimientos

- YouTube por proporcionar una interfaz web excelente
- AngularJS por el framework frontend
- La comunidad de desarrolladores por las ideas y contribuciones

---

**Nota**: Esta aplicación es para uso educativo y personal. Respeta los términos de servicio de YouTube.
