import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fonts, radius, shadow } from "@/constants/theme";
import { useAuth } from "@/context/auth";
import { useStore } from "@/context/store";

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function confirmLogout(onConfirm) {
  if (Platform.OS === "web") {
    if (window.confirm("Are you sure you want to log out?")) onConfirm();
    return;
  }
  Alert.alert("Log out?", "Are you sure you want to log out?", [
    { text: "Cancel", style: "cancel" },
    { text: "Log Out", style: "destructive", onPress: onConfirm },
  ]);
}

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const { address, orders, wishlist, totals } = useStore();

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const details = [
    { icon: "person-outline", label: "Full Name", value: user.fullName },
    { icon: "mail-outline", label: "Email", value: user.email },
    { icon: "call-outline", label: "Mobile Number", value: `+91 ${user.mobile}` },
  ];

  const menu = [
    { icon: "receipt-outline", label: "My Orders", detail: `${orders.length}`, onPress: () => router.push("/orders") },
    { icon: "heart-outline", label: "My Wishlist", detail: `${wishlist.length}`, onPress: () => router.push("/wishlist") },
    { icon: "cart-outline", label: "My Cart", detail: `${totals.count}`, onPress: () => router.push("/cart") },
    { icon: "gift-outline", label: "Gift Cards", onPress: () => router.push("/gift-cards") },
    { icon: "location-outline", label: "Find a Store", onPress: () => router.push("/stores") },
    { icon: "call-outline", label: "Call Customer Care", onPress: () => Linking.openURL("tel:18001234567") },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.topTitle}>My Account</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileDecor} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user.fullName)}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.name} numberOfLines={1}>
              {user.fullName}
            </Text>
            <Text style={styles.member}>Member since {memberSince}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Details</Text>
          {details.map((row, index) => (
            <View key={row.label} style={[styles.detailRow, index > 0 && styles.rowBorder]}>
              <View style={styles.detailIcon}>
                <Ionicons name={row.icon} size={18} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.stats}>
          {[
            ["Orders", orders.length],
            ["Wishlist", wishlist.length],
            ["In Cart", totals.count],
          ].map(([label, value]) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {address ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Saved Address</Text>
            <Text style={styles.text}>{address.address}</Text>
            <Text style={styles.text}>
              {address.city}, {address.state} - {address.pincode}
            </Text>
          </View>
        ) : null}

        <View style={styles.menu}>
          {menu.map((item, index) => (
            <Pressable
              key={item.label}
              style={[styles.menuItem, index > 0 && styles.rowBorder]}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={22} color={colors.text} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.detail ? <Text style={styles.menuDetail}>{item.detail}</Text> : null}
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logout} onPress={() => confirmLogout(signOut)}>
          <Ionicons name="log-out-outline" size={20} color={colors.sale} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 14,
  },
  topTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.text,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    overflow: "hidden",
    ...shadow.card,
  },
  profileDecor: {
    position: "absolute",
    right: -40,
    top: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    opacity: 0.12,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: fonts.bold,
    color: colors.primary,
    fontSize: 22,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: "#fff",
  },
  member: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    gap: 4,
    ...shadow.soft,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  detailValue: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  stats: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: 14,
    ...shadow.soft,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  menu: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    ...shadow.soft,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  menuLabel: {
    fontFamily: fonts.regular,
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  menuDetail: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: colors.sale,
    backgroundColor: colors.card,
  },
  logoutText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.sale,
  },
});
