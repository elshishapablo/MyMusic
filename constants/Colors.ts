// Sistema de colores rosa moderno
export const Colors = {
  // Colores principales (Rosa medio)
  primary: '#FF6B9D', // Rosa medio equilibrado
  primaryDark: '#E55A8A', // Rosa medio oscuro
  primaryLight: '#FF8FB3', // Rosa medio claro
  
  // Colores secundarios
  secondary: '#FF8FB3', // Rosa medio claro
  secondaryDark: '#FF6B9D', // Rosa medio
  secondaryLight: '#FFB3CC', // Rosa claro
  
  // Colores de acento
  accent: '#FF6B9D', // Rosa medio
  accentDark: '#E55A8A', // Rosa medio oscuro
  accentLight: '#FF8FB3', // Rosa medio claro
  
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
  gradientStart: '#FF6B9D', // Rosa medio
  gradientEnd: '#FF8FB3', // Rosa medio claro
  gradientSecondary: '#FFB3CC', // Rosa claro
  
  // Colores de botones
  buttonPrimary: '#FF6B9D', // Rosa medio
  buttonSecondary: '#2D2D2D', // Gris oscuro
  buttonDisabled: '#404040', // Gris deshabilitado
  
  // Colores de bordes
  border: '#404040', // Gris medio
  borderLight: '#606060', // Gris claro
  borderDark: '#202020', // Gris oscuro
  
  // Colores de sombra
  shadow: 'rgba(255, 107, 157, 0.3)', // Rosa medio con transparencia
  shadowDark: 'rgba(0, 0, 0, 0.5)', // Negro con transparencia
  
  // Colores de overlay
  overlay: 'rgba(0, 0, 0, 0.7)', // Negro con transparencia
  overlayLight: 'rgba(255, 107, 157, 0.15)', // Rosa medio con transparencia
};

// Gradientes predefinidos
export const Gradients = {
  primary: ['#FF6B9D', '#FF8FB3'],
  secondary: ['#FFB3CC', '#FFCCDD'],
  background: ['#0A0A0A', '#1A1A1A'],
  card: ['#1E1E1E', '#2D2D2D'],
  button: ['#FF6B9D', '#E55A8A'],
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
