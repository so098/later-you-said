import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing, typography } from "../../styles/tokens";

type Props = {
  onOpen: () => void;
  onComplete: () => void;
};

export function CardActions({ onOpen, onComplete }: Props) {
  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.primaryAction}
        activeOpacity={0.85}
        onPress={onOpen}
      >
        <Text style={styles.primaryActionText}>지금 보기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryAction}
        activeOpacity={0.85}
        onPress={onComplete}
      >
        <Text style={styles.secondaryActionText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    flex: 1.25,
    paddingVertical: spacing.xl,
  },
  primaryActionText: {
    color: colors.white,
    ...typography.bodyBold,
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    flex: 1,
    paddingVertical: spacing.xl,
  },
  secondaryActionText: {
    color: colors.textTertiary,
    ...typography.bodySemibold,
  },
});
