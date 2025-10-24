import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CustomButton } from '../components/CustomButton';

const profileOptions = [
  {
    title: 'Configuración de cuenta',
    icon: 'person-outline',
    action: 'account',
  },
  {
    title: 'Preferencias de audio',
    icon: 'volume-high-outline',
    action: 'audio',
  },
  {
    title: 'Descargas',
    icon: 'download-outline',
    action: 'downloads',
  },
  {
    title: 'Notificaciones',
    icon: 'notifications-outline',
    action: 'notifications',
  },
  {
    title: 'Privacidad',
    icon: 'shield-outline',
    action: 'privacy',
  },
  {
    title: 'Ayuda y soporte',
    icon: 'help-circle-outline',
    action: 'help',
  },
  {
    title: 'Acerca de',
    icon: 'information-circle-outline',
    action: 'about',
  },
];

const quickStats = [
  { label: 'Canciones guardadas', value: '234' },
  { label: 'Playlists creadas', value: '12' },
  { label: 'Horas escuchadas', value: '1,247' },
  { label: 'Artistas seguidos', value: '45' },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [offlineMode, setOfflineMode] = React.useState(false);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header del perfil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100x100/20B2AA/FFFFFF?text=U' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>Usuario</Text>
        <Text style={styles.userEmail}>usuario@ejemplo.com</Text>
        <CustomButton
          title="Editar perfil"
          onPress={() => console.log('Editar perfil')}
          style={styles.editButton}
        />
      </View>

      {/* Estadísticas rápidas */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Tu actividad</Text>
        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Configuraciones rápidas */}
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>Configuración rápida</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={24} color="#20B2AA" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notificaciones</Text>
              <Text style={styles.settingSubtitle}>Recibir notificaciones de música</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#333', true: '#20B2AA' }}
            thumbColor={notificationsEnabled ? '#fff' : '#ccc'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="download" size={24} color="#20B2AA" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Modo offline</Text>
              <Text style={styles.settingSubtitle}>Reproducir solo música descargada</Text>
            </View>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: '#333', true: '#20B2AA' }}
            thumbColor={offlineMode ? '#fff' : '#ccc'}
          />
        </View>
      </View>

      {/* Opciones del perfil */}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>Configuración</Text>
        {profileOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.optionItem}>
            <View style={styles.optionInfo}>
              <Ionicons name={option.icon as any} size={24} color="#20B2AA" />
              <Text style={styles.optionTitle}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón de cerrar sesión */}
      <View style={styles.logoutContainer}>
        <CustomButton
          title="Cerrar sesión"
          onPress={() => console.log('Cerrar sesión')}
          style={styles.logoutButton}
        />
      </View>

      {/* Información de la app */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Versión 1.0.0</Text>
        <Text style={styles.appCopyright}>© 2024 Mi Reproductor de Música</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#20B2AA',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#333',
    borderColor: '#20B2AA',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#ccc',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
    borderRadius: 25,
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  appVersion: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 12,
    color: '#666',
  },
});
