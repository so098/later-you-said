import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing, typography } from "../styles/tokens";
import { AlarmClockIcon } from "./AlarmClockIcon";

type Props = {
  title: string;
  description: string;
  isDevelopment: boolean;
  onReminderPress?: () => void;
};

export function PageHeader({
  title,
  description,
  isDevelopment,
  onReminderPress,
}: Props) {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.pageTitle}>{title}</Text>
        <Text style={styles.pageDescription}>{description}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={isDevelopment ? onReminderPress : undefined}
      >
        <AlarmClockIcon variant="header" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pageTitle: {
    color: colors.textPrimary,
    ...typography.pageTitle,
  },
  pageDescription: {
    color: colors.textFaint,
    fontSize: 13,
    fontWeight: "400",
    marginTop: spacing.sm,
  },
});
