import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../styles/tokens";

type Props = {
  label: string;
};

export function EmptyState({ label }: Props) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStar}>★</Text>
      <Text style={styles.emptyTitle}>{label} 상태는 아직 없어</Text>
      <Text style={styles.emptyDescription}>
        다행인지 불행인지, 여긴 아직 안 묵혔네.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginBottom: spacing.xxl,
    paddingHorizontal: 20,
    paddingVertical: 34,
  },
  emptyStar: {
    color: colors.starMuted,
    fontSize: 44,
    includeFontPadding: false,
    lineHeight: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.4,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: "400",
  },
});
