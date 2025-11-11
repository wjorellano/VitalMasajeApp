import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import PostureDashboard from "../screens/PostureDashboard";
import { HomeIcon, ChartBarIcon } from "react-native-heroicons/outline";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#222dc5ff",
        tabBarInactiveTintColor: "#cecece",
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "transparent",
          shadowOpacity: 0,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 0,
          backgroundColor: "#141414",
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="History"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <ChartBarIcon color={color} size={size} />
          ),
        }}
        component={HistoryScreen}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
