import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import TransportScreen from '../screens/TransportScreen';
import EmergencyScreenTab from '../screens/EmergencyScreenTab';
import ProfileScreen from '../screens/ProfileScreen';
import {
  HomeIcon,
  TripPlannerIcon,
  TransportIcon,
  EmergencyIcon,
} from '../components/icons';
import { AccountCircleIcon } from '../components/icons/CommonIcons';
import { AnimatedTabIcon } from '../components/AnimatedTabIcon';
import { radius } from '../theme/spacing';

const Tab = createBottomTabNavigator();

// Icon size for tabs (medium-large as requested)
const TAB_ICON_SIZE = 28;

export default function TabNavigator() {
  // Get colors inside component to avoid module initialization issues
  const activeColor = '#0F766E';
  const inactiveColor = '#94A3B8';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              Icon={HomeIcon}
              focused={focused}
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Trip"
        component={MyTripsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              Icon={TripPlannerIcon}
              focused={focused}
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Transport"
        component={TransportScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              Icon={TransportIcon}
              focused={focused}
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SOS"
        component={EmergencyScreenTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              Icon={EmergencyIcon}
              focused={focused}
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              Icon={AccountCircleIcon}
              focused={focused}
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 80 : 68,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 6,
    paddingHorizontal: 8,
    // Rounded top corners
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    // Shadow / Elevation strictly matched to brand rules
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
});
