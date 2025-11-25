import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import MiniPlayer from './components/MiniPlayer';
import { Colors } from './constants/Colors';
import { AudioProvider } from './contexts';

// Importar pantallas
import { LibraryScreen, NowPlayingScreen, ProfileScreen, SearchScreen } from './screens';
import TrackListScreen from './screens/TrackListScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Biblioteca') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Buscar') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }

          return (
            <View style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 22, 
              backgroundColor: focused ? Colors.primary : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: focused ? Colors.primary : 'transparent',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: focused ? 0.5 : 0,
              shadowRadius: 8,
              elevation: focused ? 8 : 0,
            }}>
              <Ionicons 
                name={iconName} 
                size={focused ? 24 : 22} 
                color={focused ? '#1A1A1A' : Colors.textSecondary} 
              />
            </View>
          );
        },
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#2D2D2D',
          borderRadius: 35,
          height: 72,
          paddingVertical: 0,
          paddingHorizontal: 16,
          borderTopWidth: 0,
          borderWidth: 1.5,
          borderColor: 'rgba(255, 107, 157, 0.2)',
          elevation: 35,
          shadowColor: Colors.primary,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.4,
          shadowRadius: 25,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          height: '100%',
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        },
        tabBarLabelStyle: {
          fontSize: 0,
          height: 0,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={TrackListScreen}
        options={{
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="Biblioteca" 
        component={LibraryScreen}
        options={{
          tabBarLabel: 'Biblioteca',
        }}
      />
      <Tab.Screen 
        name="Buscar" 
        component={SearchScreen}
        options={{
          tabBarLabel: 'Buscar',
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        >
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="NowPlaying" 
            component={NowPlayingScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Navigator>
        
        {/* Mini Player Global */}
        <MiniPlayer />
      </NavigationContainer>
    </AudioProvider>
  );
}