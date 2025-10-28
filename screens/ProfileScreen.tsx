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
import { MiniPlayer } from '../components/MiniPlayer';
import { Colors, Shadows } from '../constants/Colors';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

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

export default function ProfileScreen({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [offlineMode, setOfflineMode] = React.useState(false);

  const { 
    currentSong, 
    isPlaying, 
    isMiniPlayerVisible, 
    togglePlayPause, 
    hideMiniPlayer 
  } = useAudioPlayer();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header del perfil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100x100/20B2AA/FFFFFF?text=U' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color={Colors.text} />
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
            <Ionicons name="notifications" size={24} color={Colors.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notificaciones</Text>
              <Text style={styles.settingSubtitle}>Recibir notificaciones de música</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: Colors.surfaceSecondary, true: Colors.primary }}
            thumbColor={notificationsEnabled ? Colors.text : Colors.textSecondary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="download" size={24} color={Colors.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Modo offline</Text>
              <Text style={styles.settingSubtitle}>Reproducir solo música descargada</Text>
            </View>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: Colors.surfaceSecondary, true: Colors.primary }}
            thumbColor={offlineMode ? Colors.text : Colors.textSecondary}
          />
        </View>
      </View>

      {/* Opciones del perfil */}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>Configuración</Text>
        {profileOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.optionItem}>
            <View style={styles.optionInfo}>
              <Ionicons name={option.icon as any} size={24} color={Colors.primary} />
              <Text style={styles.optionTitle}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
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

    {/* Mini Player */}
    {isMiniPlayerVisible && (
      <MiniPlayer
        song={currentSong}
        isPlaying={isPlaying}
        onPress={() => navigation.navigate('NowPlaying', { song: currentSong })}
        onPlayPause={togglePlayPause}
        onNext={() => {}}
        onPrevious={() => {}}
        onClose={hideMiniPlayer}
      />
    )}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    ...Shadows.medium,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: Colors.surfaceSecondary,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    ...Shadows.small,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    ...Shadows.small,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    ...Shadows.small,
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
    color: Colors.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    ...Shadows.small,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 15,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
    borderRadius: 25,
    ...Shadows.medium,
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
