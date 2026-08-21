// MyMusic — sistema visual editorial
export const Colors = {
  primary: '#FF5C4D',
  primaryDark: '#E0483C',
  primaryLight: '#FF8A7A',

  secondary: '#E8C547',
  secondaryDark: '#C9A82E',
  secondaryLight: '#F2D978',

  accent: '#FF5C4D',
  accentDark: '#E0483C',
  accentLight: '#FF8A7A',

  background: '#09090B',
  backgroundSecondary: '#101014',
  backgroundTertiary: '#18181F',

  surface: '#141418',
  surfaceSecondary: '#1C1C24',
  surfaceTertiary: '#26262F',

  text: '#F7F4EF',
  textSecondary: '#B8B4AE',
  textTertiary: '#7A7670',
  textMuted: '#5A574F',

  success: '#3DDC97',
  warning: '#E8C547',
  error: '#FF5C4D',
  info: '#5B9DFF',

  gradientStart: '#FF5C4D',
  gradientEnd: '#FF8A7A',
  gradientSecondary: '#E8C547',

  buttonPrimary: '#FF5C4D',
  buttonSecondary: '#1C1C24',
  buttonDisabled: '#2A2A32',

  border: 'rgba(247,244,239,0.08)',
  borderLight: 'rgba(247,244,239,0.14)',
  borderDark: 'rgba(0,0,0,0.4)',

  shadow: 'rgba(255, 92, 77, 0.28)',
  shadowDark: 'rgba(0, 0, 0, 0.55)',

  overlay: 'rgba(9, 9, 11, 0.72)',
  overlayLight: 'rgba(255, 92, 77, 0.12)',
};

export const Gradients = {
  primary: ['#FF5C4D', '#FF8A7A'],
  secondary: ['#E8C547', '#F2D978'],
  background: ['#09090B', '#141418'],
  card: ['#141418', '#1C1C24'],
  button: ['#FF5C4D', '#E0483C'],
};

export const GenrePalette = [
  '#FF5C4D',
  '#E8C547',
  '#5B9DFF',
  '#3DDC97',
  '#C084FC',
  '#FB923C',
];

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 10,
  },
  glow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 8,
  },
};
