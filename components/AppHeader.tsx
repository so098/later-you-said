import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing, typography } from "../styles/tokens";

type Props = {
  isDevelopment: boolean;
  onAlarmPress: () => void;
};

export function AppHeader({ isDevelopment, onAlarmPress }: Props) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.logoWrap}>
        <Text style={styles.logoText}>나중에본다며..</Text>
        <Text style={styles.logoStar}>★</Text>
      </View>
      {isDevelopment ? (
        <TouchableOpacity
          style={styles.alarmButton}
          activeOpacity={0.8}
          onPress={onAlarmPress}
        >
          <Text style={styles.alarmButtonText}>3초</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  appHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  logoWrap: {
    alignItems: "center",
    flexDirection: "row",
  },
  logoText: {
    color: colors.textPrimary,
    ...typography.heading,
    letterSpacing: -0.6,
  },
  logoStar: {
    color: colors.starSubtle, // #CFCFCF — 1회 사용
    fontSize: 20,
    includeFontPadding: false,
    lineHeight: 22,
    marginLeft: spacing.sm,
  },
  alarmButton: {
    alignItems: "center",
    borderColor: colors.black,
    borderRadius: radius.circle,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  alarmButtonText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
});
