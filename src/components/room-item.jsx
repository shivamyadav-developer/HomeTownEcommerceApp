import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { colors } from "@/constants/theme";

const BASE_SIZE = 150;

// A product placed on the room photo: drag to move, pinch to resize, twist to rotate.
export function RoomItem({ item, selected, onSelect }) {
  const x = useSharedValue(item.x);
  const y = useSharedValue(item.y);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const select = () => onSelect(item.key);

  const pan = Gesture.Pan()
    .onStart(() => scheduleOnRN(select))
    .onChange((e) => {
      x.value += e.changeX;
      y.value += e.changeY;
    });

  const pinch = Gesture.Pinch().onChange((e) => {
    scale.value = Math.min(Math.max(scale.value * e.scaleChange, 0.3), 4);
  });

  const rotate = Gesture.Rotation().onChange((e) => {
    rotation.value += e.rotationChange;
  });

  const tap = Gesture.Tap().onEnd(() => scheduleOnRN(select));

  const gesture = Gesture.Simultaneous(pan, pinch, rotate, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
      { scaleX: item.flipped ? -1 : 1 },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.item, selected && styles.selected, animatedStyle]}>
        <Image
          source={item.product.image}
          style={[styles.image, { opacity: item.opacity }]}
          contentFit="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

export const ROOM_ITEM_SIZE = BASE_SIZE;

const styles = StyleSheet.create({
  item: {
    position: "absolute",
    left: 0,
    top: 0,
    width: BASE_SIZE,
    height: BASE_SIZE,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 6,
  },
  selected: {
    borderColor: colors.primary,
    borderStyle: "dashed",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
