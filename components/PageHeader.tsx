import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing, typography } from "../styles/tokens";

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
      {isDevelopment ? (
        <TouchableOpacity
          style={styles.testButton}
          activeOpacity={0.8}
          onPress={onReminderPress}
        >
          <Text style={styles.testButtonText}>3초</Text>
        </TouchableOpacity>
      ) : null}
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
  testButton: {
    alignItems: "center",
    borderColor: colors.black,
    borderRadius: radius.circle,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  testButtonText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
});
