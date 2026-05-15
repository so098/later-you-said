import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../styles/tokens";

type Props = {
  label: string;
  options: string[];
  activeOption: string;
  onSelect: (option: string) => void;
};

export function AddPageChipGroup({ label, options, activeOption, onSelect }: Props) {
  return (
    <View style={styles.addPageField}>
      <Text style={styles.addPageLabel}>{label}</Text>
      <View style={styles.addPageChipRow}>
        {options.map((option) => {
          const isActive = activeOption === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.addPageChip, isActive && styles.addPageChipActive]}
              activeOpacity={0.8}
              onPress={() => onSelect(option)}
            >
              <Text
                style={[
                  styles.addPageChipText,
                  isActive && styles.addPageChipTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addPageField: {
    marginBottom: spacing.pageH,
  },
  addPageLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: spacing.lg,
  },
  addPageChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  addPageChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.paddingHMd,
    paddingVertical: 9,
  },
  addPageChipActive: {
    backgroundColor: colors.black,
  },
  addPageChipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  addPageChipTextActive: {
    color: colors.white,
  },
});
