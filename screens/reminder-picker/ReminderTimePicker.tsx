import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../../styles/tokens";
import { sharedStyles } from "./sharedStyles";

type Props = {
  today: Date;
  pickerYear: number;
  pickerMonth: number;
  pickerDay: number;
  pickerHour: number | null;
  setPickerHour: (h: number) => void;
  pickerMinute: number | null;
  setPickerMinute: (m: number) => void;
};

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export function ReminderTimePicker({
  today,
  pickerYear,
  pickerMonth,
  pickerDay,
  pickerHour,
  setPickerHour,
  pickerMinute,
  setPickerMinute,
}: Props) {
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const selectedDateOnly = new Date(pickerYear, pickerMonth, pickerDay);
  const isSelectedDateToday =
    pickerYear === today.getFullYear() &&
    pickerMonth === today.getMonth() &&
    pickerDay === today.getDate();
  const isPastDate = selectedDateOnly < todayDateOnly;
  const visibleHours = isPastDate
    ? []
    : HOURS.filter((h) => !isSelectedDateToday || h >= today.getHours());
  const visibleMinutes = isPastDate
    ? []
    : MINUTES.filter(
        (m) =>
          !isSelectedDateToday ||
          pickerHour === null ||
          pickerHour !== today.getHours() ||
          m > today.getMinutes(),
      );

  return (
    <>
      <Text style={sharedStyles.sectionLabel}>시간</Text>
      <View style={styles.timeRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeScrollContent}
        >
          {visibleHours.map((h) => {
            const isActive = pickerHour === h;
            return (
              <TouchableOpacity
                key={`h-${h}`}
                style={[styles.timeChip, isActive && styles.timeChipActive]}
                activeOpacity={0.8}
                onPress={() => setPickerHour(h)}
              >
                <Text
                  style={[
                    styles.timeChipText,
                    isActive && styles.timeChipTextActive,
                  ]}
                >
                  {String(h).padStart(2, "0")}시
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.timeRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeScrollContent}
        >
          {visibleMinutes.map((m) => {
            const isActive = pickerMinute === m;
            return (
              <TouchableOpacity
                key={`m-${m}`}
                style={[styles.timeChip, isActive && styles.timeChipActive]}
                activeOpacity={0.8}
                onPress={() => setPickerMinute(m)}
              >
                <Text
                  style={[
                    styles.timeChipText,
                    isActive && styles.timeChipTextActive,
                  ]}
                >
                  {String(m).padStart(2, "0")}분
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    marginBottom: spacing.md,
    marginHorizontal: -spacing.pageH,
  },
  timeScrollContent: {
    paddingHorizontal: spacing.pageH,
  },
  timeChip: {
    backgroundColor: colors.white,
    borderColor: colors.borderSubtle,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.chipGap,
  },
  timeChipActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  timeChipText: {
    color: colors.textQuaternary, // #444444 — 2회 사용
    fontSize: 13,
    fontWeight: "600",
  },
  timeChipTextActive: {
    color: colors.white,
  },
});
