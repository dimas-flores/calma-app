import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import ResultsScreen from '../screens/ResultsScreen';
import MusicScreen from '../screens/MusicScreen';
import TCCScreen from '../screens/TCCScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MeditationScreen from '../screens/MeditationScreen';
import JournalScreen from '../screens/JournalScreen';
import SupportChatScreen from '../screens/SupportChatScreen';
import CommunityScreen from '../screens/CommunityScreen';
import AdvancedStatsScreen from '../screens/AdvancedStatsScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import TherapySessionScreen from '../screens/TherapySessionScreen';
import TreatmentPlanScreen from '../screens/TreatmentPlanScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Music') iconName = 'music';
          else if (route.name === 'TCC') iconName = 'brain';
          else if (route.name === 'Progress') iconName = 'chart-line';
          else if (route.name === 'Profile') iconName = 'account';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6B9BD1',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Music" component={MusicScreen} options={{ title: 'Música' }} />
      <Tab.Screen name="TCC" component={TCCScreen} options={{ title: 'Ejercicios' }} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progreso' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="Meditation" component={MeditationScreen} options={{ title: 'Meditación Guiada' }} />
          <Stack.Screen name="Journal" component={JournalScreen} options={{ title: 'Diario Emocional' }} />
          <Stack.Screen name="SupportChat" component={SupportChatScreen} options={{ title: 'Chat de Apoyo' }} />
          <Stack.Screen name="Community" component={CommunityScreen} options={{ title: 'Comunidad' }} />
          <Stack.Screen name="AdvancedStats" component={AdvancedStatsScreen} options={{ title: 'Estadísticas Avanzadas' }} />
          <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Ayuda de Emergencia' }} />
          <Stack.Screen name="Challenges" component={ChallengesScreen} options={{ title: 'Retos y Desafíos' }} />
          <Stack.Screen name="TherapySession" component={TherapySessionScreen} options={{ title: 'Sesiones Terapéuticas' }} />
          <Stack.Screen name="TreatmentPlan" component={TreatmentPlanScreen} options={{ title: 'Plan de Tratamiento' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
