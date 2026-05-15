import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FREQUENT_DURATIONS, REPEAT_OPTIONS } from "../../constants/reminders";
import { colors, radius, spacing } from "../../styles/tokens";
import { sharedStyles } from "./sharedStyles";

type Props = {
  pickerRepeat: string;
  setPickerRepeat: (r: string) => void;
  frequentDuration: string;
  setFrequentDuration: (duration: string) => void;
  isFrequentDurationOpen: boolean;
  setIsFrequentDurationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onToggleFrequentDurationDropdown: () => void;
};

export function ReminderRecurrence({
  pickerRepeat,
  setPickerRepeat,
  frequentDuration,
  setFrequentDuration,
  isFrequentDurationOpen,
  setIsFrequentDurationOpen,
  onToggleFrequentDurationDropdown,
}: Props) {
  return (
    <>
      <Text style={sharedStyles.sectionLabel}>반복</Text>
      <View style={styles.chipRow}>
        {REPEAT_OPTIONS.map((repeat) => {
          const isActive = pickerRepeat === repeat;
          return (
            <TouchableOpacity
              key={repeat}
              style={[styles.chip, isActive && styles.chipActive]}
              activeOpacity={0.8}
              onPress={() => {
                setPickerRepeat(repeat);
                setIsFrequentDurationOpen(false);
              }}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {repeat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.frequentRow}>
        <TouchableOpacity
          style={[
            styles.chip,
            pickerRepeat === "수시로" && styles.chipActive,
          ]}
          activeOpacity={0.8}
          onPress={() => {
            setPickerRepeat("수시로");
            setIsFrequentDurationOpen(false);
          }}
        >
          <Text
            style={[
              styles.chipText,
              pickerRepeat === "수시로" && styles.chipTextActive,
            ]}
          >
            수시로
          </Text>
        </TouchableOpacity>

        {pickerRepeat === "수시로" ? (
          <View style={styles.durationWrap}>
            <TouchableOpacity
              style={styles.durationButton}
              activeOpacity={0.8}
              onPress={onToggleFrequentDurationDropdown}
            >
              <Text style={styles.durationButtonText}>{frequentDuration}</Text>
              <View
                style={
                  isFrequentDurationOpen
                    ? styles.chevronUp
                    : styles.chevron
                }
              />
            </TouchableOpacity>

            {isFrequentDurationOpen ? (
              <View style={styles.dropdown}>
                {FREQUENT_DURATIONS.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={styles.dropdownItem}
                    activeOpacity={0.8}
                    onPress={() => {
                      setFrequentDuration(duration);
                      setIsFrequentDurationOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{duration}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  frequentRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.md,
    zIndex: 2,
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.paddingHMd,
    paddingVertical: 9, // 1회 사용 — 반복 칩 수직 패딩
  },
  chipActive: {
    backgroundColor: colors.black,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: colors.white,
  },
  durationWrap: {
    minWidth: 90, // 1회 사용 — 수시로 드롭다운 최소 너비
    position: "relative",
    zIndex: 3,
  },
  durationButton: {
    alignItems: "center",
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: 9, // 1회 사용 — duration 버튼 수직 패딩
  },
  durationButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  chevron: {
    borderLeftColor: "transparent",
    borderLeftWidth: 4,
    borderRightColor: "transparent",
    borderRightWidth: 4,
    borderTopColor: colors.textSubtle,
    borderTopWidth: 5,
    height: 0,
    marginLeft: spacing.xs,
    width: 0,
  },
  chevronUp: {
    borderBottomColor: colors.textSubtle,
    borderBottomWidth: 5,
    borderLeftColor: "transparent",
    borderLeftWidth: 4,
    borderRightColor: "transparent",
    borderRightWidth: 4,
    height: 0,
    marginLeft: spacing.xs,
    width: 0,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    elevation: 4,
    left: 0,
    position: "absolute",
    right: 0,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    top: 40, // 1회 사용 — 드롭다운 버튼 바로 아래
  },
  dropdownItem: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  dropdownItemText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
});
