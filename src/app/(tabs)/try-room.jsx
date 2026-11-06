import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RemoteImage } from "@/components/remote-image";
import { ROOM_ITEM_SIZE, RoomItem } from "@/components/room-item";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { useStore } from "@/context/store";
import { formatPrice, getCollection } from "@/data/products";

const SAMPLE_ROOM = require("@/assets/images/products/loveseat-black.jpg");

const FILTERS = [
  { label: "All", slug: "furniture" },
  { label: "Sofas", slug: "sofas" },
  { label: "Beds", slug: "beds" },
  { label: "Chairs", slug: "chairs" },
  { label: "Tables", slug: "centre-tables" },
  { label: "Decor", slug: "decor" },
  { label: "Lighting", slug: "lighting" },
  { label: "Storage", slug: "storage" },
];

const STEPS = [
  { icon: "camera-outline", text: "Take a photo of your room" },
  { icon: "add-circle-outline", text: "Pick a product to place" },
  { icon: "move-outline", text: "Drag, pinch and twist to fit" },
];

let nextKey = 1;

export default function TryRoomScreen() {
  const { width } = useWindowDimensions();
  const { addToCart, isInCart } = useStore();
  const [room, setRoom] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [filter, setFilter] = useState(FILTERS[0].slug);
  const [canvas, setCanvas] = useState(null);

  const canvasWidth = canvas?.width ?? width - 32;
  const canvasHeight = canvas?.height ?? canvasWidth;
  const selected = items.find((item) => item.key === selectedKey);
  const choices = getCollection(filter).products.slice(0, 24);

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera access needed", "Allow camera access in Settings to photograph your room.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled) startWith({ uri: result.assets[0].uri });
  }

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled) startWith({ uri: result.assets[0].uri });
  }

  function startWith(source) {
    setRoom(source);
    setItems([]);
    setSelectedKey(null);
  }

  function placeProduct(product) {
    const key = nextKey++;
    const offset = (items.length % 4) * 16;
    setItems((prev) => [
      ...prev,
      {
        key,
        product,
        x: canvasWidth / 2 - ROOM_ITEM_SIZE / 2 + offset,
        y: canvasHeight / 2 - ROOM_ITEM_SIZE / 2 + offset,
        flipped: false,
        opacity: 1,
      },
    ]);
    setSelectedKey(key);
  }

  function updateSelected(changes) {
    setItems((prev) =>
      prev.map((item) => (item.key === selectedKey ? { ...item, ...changes } : item)),
    );
  }

  function removeSelected() {
    setItems((prev) => prev.filter((item) => item.key !== selectedKey));
    setSelectedKey(null);
  }

  if (!room) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Try My Room</Text>
          <Text style={styles.subtitle}>See how furniture looks in your own space</Text>

          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="scan-outline" size={44} color={colors.primary} />
            </View>
            <Text style={styles.heroTitle}>Visualise before you buy</Text>
            <Text style={styles.heroText}>
              Take a photo of your room, then place sofas, beds, tables and decor right where you
              want them.
            </Text>

            <Pressable style={styles.primaryButton} onPress={takePhoto}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.primaryText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={pickPhoto}>
              <Ionicons name="images-outline" size={20} color={colors.primary} />
              <Text style={styles.secondaryText}>Upload from Gallery</Text>
            </Pressable>
            <Pressable onPress={() => startWith(SAMPLE_ROOM)} hitSlop={8}>
              <Text style={styles.link}>or try a sample room</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>How it works</Text>
          {STEPS.map((step, index) => (
            <View key={step.text} style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name={step.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.stepText}>
                {index + 1}. {step.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.editor}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Try My Room</Text>
            <Text style={styles.subtitle}>
              {items.length ? "Drag, pinch or twist to adjust" : "Pick a product below to place it"}
            </Text>
          </View>
          <Pressable style={styles.changeButton} onPress={() => setRoom(null)}>
            <Ionicons name="camera-reverse-outline" size={18} color={colors.primary} />
            <Text style={styles.changeText}>New photo</Text>
          </Pressable>
        </View>

        <View
          style={styles.canvas}
          onLayout={(e) => setCanvas(e.nativeEvent.layout)}
        >
          <Image source={room} style={StyleSheet.absoluteFill} contentFit="cover" />
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedKey(null)} />
          {items.map((item) => (
            <RoomItem
              key={item.key}
              item={item}
              selected={item.key === selectedKey}
              onSelect={setSelectedKey}
            />
          ))}
          {!items.length ? (
            <View style={styles.canvasHint}>
              <Ionicons name="hand-left-outline" size={16} color="#fff" />
              <Text style={styles.canvasHintText}>Choose a product below</Text>
            </View>
          ) : null}
        </View>

        {selected ? (
          <View style={styles.toolbar}>
            <View style={styles.toolbarInfo}>
              <View style={styles.flex}>
                <Text style={styles.toolbarName} numberOfLines={1}>
                  {selected.product.name}
                </Text>
                <Text style={styles.toolbarPrice}>{formatPrice(selected.product.price)}</Text>
              </View>
              <Pressable style={styles.doneButton} onPress={() => setSelectedKey(null)} hitSlop={6}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </View>
            <View style={styles.tools}>
              <Tool icon="swap-horizontal" label="Flip" onPress={() => updateSelected({ flipped: !selected.flipped })} />
              <Tool
                icon={selected.opacity < 1 ? "eye" : "eye-outline"}
                label="See-through"
                onPress={() => updateSelected({ opacity: selected.opacity < 1 ? 1 : 0.7 })}
              />
              <Tool icon="open-outline" label="View" onPress={() => router.push(`/product/${selected.product.id}`)} />
              <Tool icon="trash-outline" label="Remove" danger onPress={removeSelected} />
            </View>
            <Pressable
              style={[styles.cartButton, isInCart(selected.product.id) && styles.cartButtonDone]}
              onPress={() =>
                isInCart(selected.product.id) ? router.push("/cart") : addToCart(selected.product.id)
              }
            >
              <Ionicons
                name={isInCart(selected.product.id) ? "cart" : "cart-outline"}
                size={18}
                color="#fff"
              />
              <Text style={styles.cartText}>
                {isInCart(selected.product.id) ? "Go to Cart" : "Add to Cart"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.picker}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {FILTERS.map((f) => {
                const active = f.slug === filter;
                return (
                  <Pressable
                    key={f.slug}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setFilter(f.slug)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.products}>
              {choices.map((product) => (
                <Pressable key={product.id} style={styles.productTile} onPress={() => placeProduct(product)}>
                  <RemoteImage source={product.image} label={product.name} style={styles.productImage} />
                  <View style={styles.addBadge}>
                    <Ionicons name="add" size={16} color="#fff" />
                  </View>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function Tool({ icon, label, onPress, danger }) {
  return (
    <Pressable style={styles.tool} onPress={onPress} hitSlop={4}>
      <Ionicons name={icon} size={20} color={danger ? colors.sale : colors.text} />
      <Text style={[styles.toolLabel, danger && { color: colors.sale }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  hero: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 24,
    gap: 12,
    marginTop: 8,
    ...shadow.soft,
  },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.text,
  },
  heroText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 19,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "stretch",
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  primaryText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: "#fff",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "stretch",
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.primary,
  },
  link: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.sectionTitle,
    marginTop: 8,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    ...shadow.soft,
  },
  stepIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  flex: {
    flex: 1,
  },
  editor: {
    flex: 1,
    padding: 16,
    paddingBottom: 12,
    gap: 12,
  },
  picker: {
    gap: 10,
  },
  doneButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },
  doneText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
  },
  changeText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.primary,
  },
  canvas: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.placeholder,
    ...shadow.card,
  },
  canvasHint: {
    position: "absolute",
    alignSelf: "center",
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  canvasHintText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: "#fff",
  },
  toolbar: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    gap: 10,
    ...shadow.soft,
  },
  toolbarInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toolbarName: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  toolbarPrice: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text,
  },
  tools: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tool: {
    alignItems: "center",
    gap: 2,
    minWidth: 64,
  },
  toolLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.text,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
  },
  cartButtonDone: {
    backgroundColor: colors.success,
  },
  cartText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: "#fff",
  },
  chips: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  chipTextActive: {
    color: "#fff",
  },
  products: {
    gap: 10,
    paddingVertical: 4,
  },
  productTile: {
    width: 112,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 6,
    ...shadow.soft,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.sm,
  },
  addBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.text,
    marginTop: 6,
  },
  productPrice: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text,
  },
});
