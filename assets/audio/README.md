# 🎵 Archivos de Audio para la Demo

## 📁 **Cómo Agregar Música Real**

### **1. Crear Carpeta de Audio**

```
assets/audio/
├── queen-bohemian-rhapsody.mp3
├── michael-jackson-billie-jean.mp3
├── led-zeppelin-stairway.mp3
└── ...
```

### **2. Formato de Archivos**

- **Formato**: MP3, WAV, M4A
- **Calidad**: 128kbps o superior
- **Duración**: 30 segundos a 5 minutos (para demo)

### **3. Actualizar URLs en el Código**

```typescript
// En data/demoMusic.ts
audioUrl: require('../assets/audio/queen-bohemian-rhapsody.mp3'),
```

## 🎵 **Archivos de Audio Gratuitos**

### **Sitios Recomendados:**

- **Freesound.org** - Efectos y música libre
- **Zapsplat** - Efectos de sonido gratuitos
- **YouTube Audio Library** - Música libre de derechos
- **Incompetech** - Música de Kevin MacLeod

### **Música Clásica Libre:**

- **Musopen** - Música clásica de dominio público
- **Internet Archive** - Archivos históricos
- **Wikimedia Commons** - Recursos multimedia libres

## ⚠️ **Importante - Derechos de Autor**

### **Para Demo/Prueba:**

- Usa solo **música libre de derechos**
- **No uses** música comercial sin permiso
- **Prueba** con archivos de 30 segundos

### **Para Producción:**

- **Obtén licencias** para música comercial
- **Usa servicios** como Spotify/Apple Music APIs
- **Contrata** compositores independientes

## 🚀 **Implementación Rápida**

1. **Descarga** archivos de audio gratuitos
2. **Colócalos** en `assets/audio/`
3. **Actualiza** las URLs en `demoMusic.ts`
4. **¡Reproduce** música real!

## 🎶 **Ejemplo de Archivo de Audio**

```typescript
{
  id: '1',
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
  album: 'A Night at the Opera',
  duration: 355,
  image: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Queen',
  audioUrl: require('../assets/audio/queen-bohemian-rhapsody.mp3'), // ← Archivo local
  genre: 'Rock',
  year: 1975,
  isLiked: true,
}
```
