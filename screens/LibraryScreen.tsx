import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Mi Biblioteca
        </Text>
        
        <Text style={styles.subtitle}>
          Aquí puedes ver tu música guardada
        </Text>
        
        <View style={styles.featureContainer}>
          <Text style={styles.description}>
            Esta pantalla está en desarrollo. Próximamente podrás:
          </Text>
          
          <View style={styles.featureList}>
            <Text style={styles.feature}>• Ver tus canciones favoritas</Text>
            <Text style={styles.feature}>• Crear y gestionar playlists</Text>
            <Text style={styles.feature}>• Ver tu historial de reproducción</Text>
            <Text style={styles.feature}>• Descargar música para escuchar offline</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  featureContainer: {
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
    color: Colors.text,
    textAlign: 'center',
  },
  featureList: {
    marginTop: 16,
  },
  feature: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
    paddingLeft: 8,
    color: Colors.textSecondary,
  },
});