// Sistema de colores fucsia/rosado moderno
export const Colors = {
  // Colores principales
  primary: '#FF1493', // Deep Pink
  primaryDark: '#C71585', // Medium Violet Red
  primaryLight: '#FF69B4', // Hot Pink
  
  // Colores secundarios
  secondary: '#FFB6C1', // Light Pink
  secondaryDark: '#FF91A4', // Pink
  secondaryLight: '#FFC0CB', // Pink
  
  // Colores de acento
  accent: '#FF10F0', // Magenta
  accentDark: '#DA70D6', // Orchid
  accentLight: '#FFB6C1', // Light Pink
  
  // Colores de fondo
  background: '#0A0A0A', // Negro profundo
  backgroundSecondary: '#1A1A1A', // Gris muy oscuro
  backgroundTertiary: '#2A2A2A', // Gris oscuro
  
  // Colores de superficie
  surface: '#1E1E1E', // Gris oscuro
  surfaceSecondary: '#2D2D2D', // Gris medio oscuro
  surfaceTertiary: '#3A3A3A', // Gris medio
  
  // Colores de texto
  text: '#FFFFFF', // Blanco
  textSecondary: '#E0E0E0', // Gris claro
  textTertiary: '#B0B0B0', // Gris medio
  textMuted: '#808080', // Gris
  
  // Colores de estado
  success: '#00FF7F', // Spring Green
  warning: '#FFD700', // Gold
  error: '#FF4444', // Red
  info: '#00BFFF', // Deep Sky Blue
  
  // Colores de gradiente
  gradientStart: '#FF1493', // Deep Pink
  gradientEnd: '#FF10F0', // Magenta
  gradientSecondary: '#FF69B4', // Hot Pink
  
  // Colores de botones
  buttonPrimary: '#FF1493', // Deep Pink
  buttonSecondary: '#2D2D2D', // Gris oscuro
  buttonDisabled: '#404040', // Gris deshabilitado
  
  // Colores de bordes
  border: '#404040', // Gris medio
  borderLight: '#606060', // Gris claro
  borderDark: '#202020', // Gris oscuro
  
  // Colores de sombra
  shadow: 'rgba(255, 20, 147, 0.3)', // Rosa con transparencia
  shadowDark: 'rgba(0, 0, 0, 0.5)', // Negro con transparencia
  
  // Colores de overlay
  overlay: 'rgba(0, 0, 0, 0.7)', // Negro con transparencia
  overlayLight: 'rgba(255, 20, 147, 0.1)', // Rosa con transparencia
};

// Gradientes predefinidos
export const Gradients = {
  primary: ['#FF1493', '#FF10F0'],
  secondary: ['#FF69B4', '#FFB6C1'],
  background: ['#0A0A0A', '#1A1A1A'],
  card: ['#1E1E1E', '#2D2D2D'],
  button: ['#FF1493', '#C71585'],
};

// Sombras predefinidas
export const Shadows = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
};
