import { terminal as t } from "@/theme/terminal";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";

function TabIcon({ label, active }: { label: string; active: boolean }) {
  return (
    <Text
      style={[styles.tabLabel, active ? styles.tabLabelActive : styles.tabLabelInactive]}
    >
      {label}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="[ INTEL ]" active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="[ SOS ]" active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="[ CONFIG ]" active={focused} />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: t.colors.bgRaised,
    borderTopWidth: 1,
    borderTopColor: t.colors.primaryMuted,
    height: Platform.OS === "android" ? 52 : 64,
  },
  tabLabel: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: t.colors.primary,
    fontWeight: "700",
  },
  tabLabelInactive: {
    color: t.colors.textMuted,
  },
});
