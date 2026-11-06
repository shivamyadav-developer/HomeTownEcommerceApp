import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { colors, fonts, shadow } from "@/constants/theme";

const ICON_SIZE = 22;

// Short, single-line labels so all six tabs share the same size and spacing.
const TABS = [
  { name: "index", title: "Home", icon: "home" },
  { name: "categories", title: "Categories", icon: "grid" },
  { name: "stores", title: "Stores", icon: "location" },
  { name: "try-room", title: "Try Room", icon: "scan-circle" },
  { name: "gift-cards", title: "Gift", icon: "gift" },
  { name: "account", title: "Account", icon: "person" },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: styles.bar,
        tabBarItemStyle: styles.item,
        tabBarIconStyle: styles.icon,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? tab.icon : `${tab.icon}-outline`}
                size={ICON_SIZE}
                color={color}
              />
            ),
            tabBarLabel: ({ color, focused }) => (
              <Text
                numberOfLines={1}
                style={[styles.label, { color }, focused && styles.labelActive]}
              >
                {tab.title}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.tabBar,
    borderTopWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 6,
    ...shadow.raised,
  },
  item: {
    paddingHorizontal: 0,
  },
  icon: {
    width: ICON_SIZE + 4,
    height: ICON_SIZE + 4,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
  labelActive: {
    fontFamily: fonts.semibold,
  },
});
