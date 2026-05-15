import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../../styles/tokens";

type Props = {
  viewYear: number;
  viewMonth: number;
  pickerYear: number;
  pickerMonth: number;
  pickerDay: number;
  today: Date;
  calendarDays: (number | null)[];
  selectDay: (day: number) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function ReminderCalendar({
  viewYear,
  viewMonth,
  pickerYear,
  pickerMonth,
  pickerDay,
  today,
  calendarDays,
  selectDay,
}: Props) {
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  return (
    <>
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day, i) => (
          <View key={day} style={styles.weekdayCell}>
            <Text
              style={[
                styles.weekdayText,
                i === 0 && styles.weekdayTextSun,
                i === 6 && styles.weekdayTextSat,
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.dayGrid}>
        {calendarDays.map((day, index) => {
          const dayOfWeek = index % 7;
          const cellDate =
            day === null ? null : new Date(viewYear, viewMonth, day);
          const todayDateOnly = new Date(todayYear, todayMonth, todayDate);
          const isPastDay = cellDate !== null && cellDate < todayDateOnly;
          const isSelected =
            day !== null &&
            !isPastDay &&
            day === pickerDay &&
            viewYear === pickerYear &&
            viewMonth === pickerMonth;
          const isToday =
            day === todayDate &&
            viewMonth === todayMonth &&
            viewYear === todayYear;
          return (
            <TouchableOpacity
              key={index}
              style={styles.dayCell}
              activeOpacity={day === null || isPastDay ? 1 : 0.7}
              disabled={day === null || isPastDay}
              onPress={() => day !== null && !isPastDay && selectDay(day)}
            >
              {day !== null ? (
                <View
                  style={[styles.dayPill, isSelected && styles.dayPillActive]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      dayOfWeek === 0 && !isSelected && styles.dayTextSun,
                      dayOfWeek === 6 && !isSelected && styles.dayTextSat,
                      isToday && !isSelected && styles.dayTextToday,
                      isPastDay && styles.dayTextDisabled,
                      isSelected && styles.dayTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  weekdayRow: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  weekdayCell: {
    alignItems: "center",
    flex: 1,
    paddingVertical: spacing.sm,
  },
  weekdayText: {
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: "600",
  },
  weekdayTextSun: {
    color: colors.accentSun,
  },
  weekdayTextSat: {
    color: colors.accentSat,
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    alignItems: "center",
    paddingVertical: 3, // 1회 사용 — 날짜 셀 수직 여백
    width: `${100 / 7}%`,
  },
  dayPill: {
    alignItems: "center",
    borderRadius: radius.sm,
    height: 32, // 1회 사용 — 날짜 pill 크기
    justifyContent: "center",
    width: 32, // 1회 사용 — 날짜 pill 크기
  },
  dayPillActive: {
    backgroundColor: colors.black,
  },
  dayText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  dayTextSun: {
    color: colors.accentSun,
  },
  dayTextSat: {
    color: colors.accentSat,
  },
  dayTextToday: {
    fontWeight: "800",
  },
  dayTextDisabled: {
    color: colors.placeholder,
  },
  dayTextActive: {
    color: colors.white,
    fontWeight: "700",
  },
});
