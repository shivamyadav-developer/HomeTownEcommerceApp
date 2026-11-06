// Text and accent colours follow the HomeTown (hometown.in) palette.
export const colors = {
  background: "#FDF0F1",
  card: "#FFFFFF",
  text: "#000000", // HomeTown foreground / headings
  muted: "#666666", // HomeTown subtext
  accent: "#D45C36", // HomeTown brand-1
  accentSoft: "#FBEFEB", // HomeTown brand-1 tint
  primary: "#D45C36", // HomeTown brand-1 (buttons)
  primaryHover: "#BA4B28", // HomeTown brand-1 hover
  primarySoft: "#FBEFEB", // HomeTown brand-1 tint
  brandRed: "#E31C1C", // HomeTown brand-2
  brandBrown: "#4A2C20", // "Home" in the HomeTown wordmark
  brandOrange: "#E8561C", // "Town" in the HomeTown wordmark
  sale: "#D75B5B", // HomeTown sale price / sale badge
  saleSoft: "#FCE8E8", // HomeTown brand-2 tint
  success: "#0D8756", // HomeTown "new" badge / progress
  successSoft: "#E3F3EC",
  star: "#F5A623",
  border: "#E5E5E5", // HomeTown border
  sectionTitle: "#D45C36", // HomeTown brand-1
  dealsTitle: "#9C3F21", // HomeTown brand-1 active
  placeholder: "#EDEDED", // HomeTown secondary background
  placeholderText: "#999999",
  tabBar: "#FFFFFF",
  tabInactive: "#999999",
  divider: "#666666",
};

export const fonts = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
};

// Cross-platform shadows (React Native boxShadow).
export const shadow = {
  soft: { boxShadow: "0px 2px 8px rgba(120, 60, 60, 0.10)" },
  card: { boxShadow: "0px 4px 14px rgba(120, 60, 60, 0.14)" },
  raised: { boxShadow: "0px -2px 12px rgba(0, 0, 0, 0.08)" },
};
