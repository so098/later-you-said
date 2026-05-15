import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../../styles/tokens";

type Props = {
  isTimePicked: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ReminderPickerFooter({ isTimePicked, onClose, onConfirm }: Props) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.cancelButton}
        activeOpacity={0.85}
        onPress={onClose}
      >
        <Text style={styles.cancelText}>닫기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.confirmButton, !isTimePicked && styles.confirmButtonDisabled]}
        activeOpacity={isTimePicked ? 0.85 : 1}
        disabled={!isTimePicked}
        onPress={onConfirm}
      >
        <Text style={styles.confirmText}>
          {isTimePicked ? "완료" : "시간 골라줘"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: spacing.lg,
    paddingBottom: spacing.section,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.xl,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flex: 1,
    paddingVertical: spacing.footerV,
  },
  cancelText: {
    color: colors.textQuaternary, // #444444 — 2회 사용
    fontSize: 14,
    fontWeight: "700",
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: colors.black,
    borderRadius: radius.md,
    flex: 1.5,
    paddingVertical: spacing.footerV,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.borderStrong,
  },
  confirmText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
