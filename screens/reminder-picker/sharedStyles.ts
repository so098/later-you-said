import { StyleSheet } from "react-native";
import { colors, spacing } from "../../styles/tokens";

export const sharedStyles = StyleSheet.create({
  sectionLabel: {
    color: colors.textSection, // #666666 — 1회 사용
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: spacing.lg,
  },
});
