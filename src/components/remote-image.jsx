import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "@/constants/theme";

// Shows the image when a source is set, otherwise a labelled placeholder of the same size.
export function RemoteImage({ source, label, style, icon = "image-outline" }) {
  if (!source) {
    return (
      <View style={[styles.placeholder, style]}>
        <Ionicons name={icon} size={22} color={colors.placeholderText} />
        {label ? (
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        ) : null}
      </View>
    );
  }

  return <Image source={source} style={style} contentFit="cover" transition={200} />;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.placeholder,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: 6,
  },
  label: {
    fontFamily: fonts.regular,
    color: colors.placeholderText,
    fontSize: 12,
    textAlign: "center",
  },
});
