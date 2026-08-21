import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MiniPlayer from './components/MiniPlayer';
import { Colors } from './constants/Colors';
import { AudioProvider, UserProvider, useUser } from './contexts';

// Importar pantallas
import { NowPlayingScreen, ProfileScreen, SearchScreen } from './screens';
import TrackListScreen from './screens/TrackListScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import LoginScreen from './screens/LoginScreen';

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
          } else if (route.name === 'Favoritas') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Buscar') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }

          return (
            <View style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 14, 
              backgroundColor: focused ? Colors.primary : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons 
                name={iconName} 
                size={focused ? 22 : 21} 
                color={focused ? Colors.background : Colors.textTertiary} 
              />
            </View>
          );
        },
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 18,
          left: 18,
          right: 18,
          backgroundColor: Colors.surface,
          borderRadius: 24,
          height: 68,
          paddingVertical: 0,
          paddingHorizontal: 12,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: Colors.border,
          elevation: 12,
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
        name="Favoritas" 
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritas',
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

function MainNavigator() {
  const { isLoggedIn, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
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
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <AudioProvider>
          <MainNavigator />
        </AudioProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
