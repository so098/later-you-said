import { StyleSheet, Text, View } from "react-native";
import { AlarmClockIcon } from "../AlarmClockIcon";
import { colors, radius, spacing, typography } from "../../styles/tokens";

type Props = {
  reminder: string;
  pressure: string;
};

export function CardReminderBox({ reminder, pressure }: Props) {
  return (
    <View style={styles.reminderBox}>
      <View style={styles.reminderTimeRow}>
        <AlarmClockIcon />
        <Text style={styles.reminderTime}>{reminder}</Text>
      </View>
      <Text style={styles.reminderCopy}>{pressure}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reminderBox: {
    backgroundColor: colors.surfaceAlt, // #F7F7F7 — 1회 사용
    borderRadius: radius.md,
    marginTop: 15, // reminder box 위 간격 — 1회 사용
    padding: spacing.xxl,
  },
  reminderTimeRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5, // 아이콘-시간 행과 카피 사이 간격 — 1회 사용
  },
  reminderTime: {
    color: colors.textPrimary,
    ...typography.bodyBold,
  },
  reminderCopy: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 19,
  },
});
